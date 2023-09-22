/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import { Promise as Bluebird } from 'bluebird';
import { Cache } from 'cache-manager';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { LoggerService } from '@app/modules/logger';
import { EventBusService } from '@app/modules/event-bus';
import { EmailMessageChangedEvent } from '@app/events/service-provider/email-message-changed.event';
import { MessageChangeInterface } from '@app/interfaces/service-provider/message-change.interface';
import {
  CacheLock,
  ConcurrentProcessingError,
} from '@app/modules/cache/cache-lock.service';
import { Maybe } from '@app/modules/utils';

import { GoogleService } from '../../services/provider/adapters/google/google.service';
import ConnectionRepository from '../../entities/repositories/connection.repository';
import { ManagedBy } from '../../service-provider.enums';
import ConnectionEntity from '../../entities/connection.entity';
import { HistoryIdNotFoundError } from '../../errors/history-id-not-found.error';
import { InvalidTokenError } from '../../errors/invalid-token.error';
import { InvalidTokenEvent } from '../../events/invalid-token.event';
import { ConnectionWithHistory } from '../../services/provider/adapters/google/types';

import { ProcessGmailHistoryCommand } from './process-gmail-history.command';
import { getLastHistoryIdCacheKey, isGreater } from './util';

const lastHistoryIdTtl = 60 * 2; // seconds

function getLastHistoryId(
  command: ProcessGmailHistoryCommand,
  connection: ConnectionEntity,
  messageChanges: MessageChangeInterface[],
): Maybe<string> {
  if (messageChanges.length) {
    return messageChanges[messageChanges.length - 1].historyId;
  }
  if (command.newHistoryId) {
    return command.newHistoryId;
  }
  return connection.lastHistoryId;
}

function updateConnection(
  command: ProcessGmailHistoryCommand,
  connection: ConnectionEntity,
  messageChanges: MessageChangeInterface[],
): void {
  const now = new Date();
  connection.lastHistoryId = getLastHistoryId(
    command,
    connection,
    messageChanges,
  );
  connection.updatedAt = messageChanges.length > 0 ? now : connection.updatedAt;
  connection.lastHistoryProcessedAt = now;
}

function shouldProcess(
  log: LoggerService,
  connection: ConnectionEntity,
): boolean {
  if (connection.managedBy !== ManagedBy.Internal) return false;
  if (connection.status === Status.Invalid) {
    log.warn('Connection is invalid. Aborting');
    return false;
  }
  return true;
}

@CommandHandler(ProcessGmailHistoryCommand)
export class ProcessGmailHistoryCommandHandler
  implements ICommandHandler<ProcessGmailHistoryCommand>
{
  constructor(
    private readonly google: GoogleService,
    private readonly connRepo: ConnectionRepository,
    private readonly log: LoggerService,
    private readonly eventBus: EventBusService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly cacheLock: CacheLock,
  ) {}

  private async updateCachedHistoryId(
    emailAddress: string,
    newHistoryId: string,
  ): Promise<void> {
    const cacheKey = getLastHistoryIdCacheKey(emailAddress);
    const cachedHistoryId = (await this.cache.get(cacheKey)) as Maybe<string>;
    if (isGreater(newHistoryId, cachedHistoryId)) {
      await this.cache.set(cacheKey, newHistoryId, {
        ttl: lastHistoryIdTtl,
      });
    }
  }

  async execute(command: ProcessGmailHistoryCommand): Promise<any> {
    const { connectionId } = command;
    // prevent parallel processing of same email address;
    const connection = await this.connRepo.findOne(connectionId);
    if (!connection) {
      this.log.error({ connectionId }, 'no connection found');
      return;
    }
    const [{ newHistoryId }, { emailAddress, lastHistoryId }] = [
      command,
      connection,
    ];

    if (!shouldProcess(this.log, connection)) {
      return;
    }

    const cacheKey = `process-gmail-cacheLock-${connection.emailAddress}`;

    try {
      await this.cacheLock.withLock(
        {
          cache: this.cache,
          cacheKey,
          ttl: 30,
          extTtl: 10,
        },
        async () => {
          this.log.info(
            { historyId: newHistoryId, lastHistoryId },
            'Fetching message changes from history',
          );
          if (!connection.lastHistoryId) {
            return;
          }
          const historyCursor = await this.google.getPaginatedHistory(
            connection as ConnectionWithHistory,
          );
          this.log.info('got initial history cursor');

          let pageNum = 0;
          let numMessages = 0;
          while (historyCursor.hasNext) {
            const page = await historyCursor.next();
            pageNum += 1;

            this.log.info(
              { pageNum, hastNext: historyCursor.hasNext },
              'got history page',
            );

            if (!page?.length) {
              continue;
            }

            const messageChanges =
              await this.google.getMessageChangesFromHistoryMessages(
                historyCursor.client,
                connection,
                page,
              );
            numMessages += messageChanges.length;

            this.log.info(
              { changeCount: messageChanges.length, page: pageNum },
              'Got message changes from history',
            );

            updateConnection(command, connection, messageChanges);
            await this.connRepo.persistAndFlush(connection);

            await Bluebird.map(
              messageChanges,
              async (change) => {
                await this.eventBus.publish(
                  new EmailMessageChangedEvent(change),
                );
              },
              { concurrency: 10 },
            );
            this.log.info(
              { changeCount: messageChanges.length, page: pageNum },
              'Published message changes',
            );

            if (connection.lastHistoryId) {
              await this.updateCachedHistoryId(
                emailAddress,
                connection.lastHistoryId,
              );
            }
          }
          this.log.info(
            {
              historyId: newHistoryId,
              lastHistoryId,
              newLastHistoryId: connection.lastHistoryId,
              numMessages,
            },
            'completed',
          );
        },
      ); // end cacheLock
    } catch (error) {
      if (error instanceof HistoryIdNotFoundError) {
        this.log.warn('History ID not found in google. Requesting new one.');
        // todo: we may have missed messages and should scan backwards until we reach a message we do have in cache to make sure we are in sync
        await this.google.renewWatch(connection);
        await this.connRepo.persistAndFlush(connection);
      } else if (error instanceof InvalidTokenError) {
        this.log.warn({ error }, 'Token is invalid.');
        await this.eventBus.publish(
          new InvalidTokenEvent({ connectionId: connection.connectionId }),
        );
      } else if (error instanceof ConcurrentProcessingError) {
        this.log.warn(
          { email: connection.emailAddress, historyId: newHistoryId },
          'Currently processing gmail for email. Try later.',
        );
        throw error;
      } else {
        this.log.error({ error }, 'Error processing gmail history');
      }
      throw error;
    }
  }
}
