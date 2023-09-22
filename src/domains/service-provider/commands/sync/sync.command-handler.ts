/* eslint-disable no-await-in-loop */
import * as Bluebird from 'bluebird';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { ConnectionSyncEvent } from '@app/events/service-provider/connection-sync.event';
import { EventBusService } from '@app/modules/event-bus';
import { EmailMessageSyncedEvent } from '@app/events/service-provider/email-message-synced.event';
import { LoggerService } from '@app/modules/logger';
import QuotaExceededError from '@app/errors/service-provider/quota-exceeded.error';
import { Span, TelemetryService } from '@app/modules/telemetry';
import { Maybe } from '@app/modules/utils';
import { AsyncContextService } from '@app/modules/async-context';

import SyncEntity from '../../entities/sync.entity';
import { ProviderService } from '../../services/provider/provider.service';
import { SentReceivedEntity } from '../../entities/sent-received.entity';
import HistoryMessageEntity from '../../entities/history-message.entity';
import { ServiceProviderService } from '../../services/service-provider.service';
import { ProviderSyncResponse } from '../../services/provider/adapters/provider.adapter.interface';
import { InvalidTokenError } from '../../errors/invalid-token.error';
import { InvalidTokenEvent } from '../../events/invalid-token.event';

import { SyncCommand } from './sync.command';

const maxRetries = 10;
const retryDelayMs = 10000;
const exponentialBackoff = 1.5;
const delayBetweenPagesMs = 800;
const publishConcurrency = 10;

@CommandHandler(SyncCommand)
export class SyncCommandHandler implements ICommandHandler<SyncCommand> {
  constructor(
    private provider: ProviderService,
    private eventBus: EventBusService,
    private log: LoggerService,
    private em: EntityManager,
    private serviceProviderService: ServiceProviderService,
    private telemetry: TelemetryService,
    private ac: AsyncContextService,
  ) {}

  async execute(command: SyncCommand): Promise<any> {
    // eslint-disable-next-line no-sync
    const span = this.telemetry.customSpan(Span.ConnectionSync);

    let em: EntityManager;
    if (process.env.APP_MODE === 'job') {
      em = this.em.fork();
    } else {
      em = this.em;
    }

    const sync = await em.findOneOrFail(SyncEntity, command.connectionSyncId, {
      populate: ['connection'],
    });

    const { connection } = sync;

    if (process.env.APP_MODE === 'job') {
      this.ac.register({
        userId: connection.userId,
        connectionId: connection.connectionId,
      });
    }

    const logMeta = {
      connectionSyncId: sync.connectionSyncId,
      syncType: sync.type,
    };

    this.log.info(logMeta, `Starting Connection Sync ${sync.type}`);

    sync.startedAt = sync.startedAt || new Date();
    sync.isSyncing = true;
    await em.persistAndFlush(sync);

    // begin the work
    let page = 0;
    try {
      while (!sync.finishedAt) {
        page++;
        this.log.info(logMeta, `Retrieving page: ${page}`);
        const sentReceivedEntities: SentReceivedEntity[] = [];

        let result: Maybe<ProviderSyncResponse>;

        let retries = 0;
        const getMessages = async (): Promise<void> => {
          try {
            result = await this.provider.adapters[
              connection.provider
            ].syncMessages(sync.connection, sync.type, sync.pageToken);
            retries = 0;
          } catch (error) {
            const isQuotaError = error instanceof QuotaExceededError;

            if (isQuotaError && retries < maxRetries) {
              this.log.warn(
                {
                  retries,
                  userId: sync.connection.userId,
                  ...logMeta,
                },
                'Quota hit during sync. Delaying for retry',
              );
              await new Promise((resolve) =>
                // eslint-disable-next-line no-promise-executor-return
                setTimeout(
                  () => resolve(true),
                  retryDelayMs * (retries ? retries * exponentialBackoff : 1),
                ),
              );
              retries++;
              return getMessages();
            }
            throw error;
          }
        };
        this.log.info({ page }, 'getting page of messages');
        await getMessages();

        let isFinished;
        if (result && result.messages?.length > 0) {
          // result is undefined if there are no hits on the syncMessages call
          const messages = result.messages || [];
          messages.forEach((message) => {
            sentReceivedEntities.push(
              ...this.serviceProviderService.buildSentReceiveEntitiesFromMessage(
                message,
              ),
            );
          });
          const messageEntities = messages.map(
            (message) =>
              new HistoryMessageEntity({
                ...message,
                connection: sync.connection,
              }),
          );

          this.log.info(
            {
              pageSize: result.messages.length,
              page,
              messages: messageEntities.length,
              ...logMeta,
            },
            'Got page of messages',
          );

          this.log.info(
            logMeta,
            `Saving ${messageEntities.length} message entities.`,
          );
          await em
            .createQueryBuilder(HistoryMessageEntity)
            .insert(messageEntities)
            .onConflict(['external_message_id'])
            .ignore()
            .execute('run');

          this.log.info(
            logMeta,
            `Saving ${messageEntities.length} sentReceived entities.`,
          );
          await em
            .createQueryBuilder(SentReceivedEntity)
            .insert(sentReceivedEntities)
            .onConflict([
              'user_id',
              'external_message_id',
              'username',
              'domain',
            ])
            .ignore()
            .execute('run');

          this.log.info(
            logMeta,
            `Publishing message sync events: ${messageEntities.length}`,
          );
          await Bluebird.map(
            messageEntities,
            (message: HistoryMessageEntity) =>
              this.eventBus.publish(new EmailMessageSyncedEvent(message)),
            { concurrency: publishConcurrency },
          );

          this.log.info('published EmailMessageSyncedEvent messages');
          sync.pageToken = result.nextPageToken;
          sync.lastDepth = messages[messages.length - 1].receivedAt;
          isFinished = sync.lastDepth < sync.targetDepth || !sync.pageToken;
        } else {
          isFinished = true;
        }

        if (isFinished) {
          sync.finishedAt = new Date();
        }

        // publish sync status
        await this.eventBus.publish(new ConnectionSyncEvent(sync));

        if (isFinished) {
          this.log.info(logMeta, `Sync finished ${sync.type}`);
          // end the loop once we have reached the end of the sync
          break;
        }

        await new Promise((resolve) => {
          setTimeout(() => resolve(true), delayBetweenPagesMs);
        });
      }
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        this.log.warn({ error, ...logMeta }, 'Token is invalid.');
        await this.eventBus.publish(
          new InvalidTokenEvent({ connectionId: sync.connectionId }),
        );
        return;
      }
      this.log.error({ error, ...logMeta }, 'Error processing connection sync');
      // if it errors, allow the lock to be release but persist the depth information we got to above so that a future job can pick it up and try to continue
    } finally {
      sync.isSyncing = false; // release the isSyncing lock
      await em.persistAndFlush(sync); // save the record
      span?.end();
    }
  }
}
