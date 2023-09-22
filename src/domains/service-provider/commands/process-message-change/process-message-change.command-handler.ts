import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Cache } from 'cache-manager';
import { MessageChangeInterface } from '@app/interfaces/service-provider/message-change.interface';
import { EmailMessageCreatedEvent } from '@app/events/service-provider/email-message-created.event';
import { getWithDefault } from '@app/modules/cache';
import { LoggerService } from '@app/modules/logger';
import { EventBusService } from '@app/modules/event-bus';
import { SpanEvent, TelemetryService } from '@app/modules/telemetry';
import { EmailMessageLabelsAddedEvent } from '@app/events/service-provider/email-message-labels-added.event';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';

import GmailHistoryEntity from '../../entities/gmail-history.entity';
import HistoryThreadEntity from '../../entities/history-thread.entity';
import HistoryMessageEntity from '../../entities/history-message.entity';
import ConnectionRepository from '../../entities/repositories/connection.repository';
import HistoryMessageRepository from '../../entities/repositories/history-message.repository';
import HistoryThreadRepository from '../../entities/repositories/history-thread.repository';
import ServiceProviderConfig from '../../service-provider.config';
import { GoogleService } from '../../services/provider/adapters/google/google.service';

import { ProcessMessageChangeCommand } from './process-message-change.command';

const historyTtl = 60 * 2;

const candidateLabels = [
  Label.Inbox,
  Label.Sent,
  Label.TrainAsAllowed,
  Label.TrainAsGated,
];

export function isCandidate({ labels }: MessageChangeInterface): boolean {
  if (labels.includes(Label.Spam)) {
    return false;
  }
  return !!labels.find((label) => candidateLabels.includes(label));
}

@CommandHandler(ProcessMessageChangeCommand)
export class ProcessMessageChangeCommandHandler
  implements ICommandHandler<ProcessMessageChangeCommand>
{
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly connRepo: ConnectionRepository,
    private readonly messageRepo: HistoryMessageRepository,
    private readonly threadRepo: HistoryThreadRepository,
    private readonly log: LoggerService,
    private readonly eventBus: EventBusService,
    @InjectRepository(GmailHistoryEntity)
    private gmailHistoryRepo: EntityRepository<GmailHistoryEntity>,
    private readonly em: EntityManager,
    @Inject(ServiceProviderConfig.KEY)
    private config: ConfigType<typeof ServiceProviderConfig>,
    private readonly telemetry: TelemetryService,
    private google: GoogleService,
  ) {}

  private async upsertThread(
    change: MessageChangeInterface,
  ): Promise<HistoryThreadEntity> {
    let thread = await this.threadRepo.findOne({
      externalThreadId: change.externalThreadId,
    });
    if (!thread) {
      thread = new HistoryThreadEntity({
        externalThreadId: change.externalThreadId,
        userId: change.message.userId,
        firstMessageAt: change.message.receivedAt,
        connection: this.connRepo.getReference(change.connectionId),
      });
      this.threadRepo.persist(thread);
    }
    return thread;
  }

  private async messageCreated(change: MessageChangeInterface): Promise<void> {
    if (change.message.isDraft) {
      this.log.debug('Ignoring change as its a draft message');
      return;
    }

    const thread = await this.upsertThread(change);

    const existing = await this.messageRepo.findOne({
      externalMessageId: change.message.externalMessageId,
    });

    if (existing) {
      this.log.warn({ change }, 'Message already processed. Aborting.');
      return;
    }

    const newMessage = new HistoryMessageEntity({
      ...change.message,
      thread,
      connection: this.connRepo.getReference(change.connectionId),
    });

    const connection = await this.connRepo.findOneOrFail(change.connectionId);

    this.messageRepo.persist(newMessage);
    try {
      await this.em.flush();
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        this.log.warn(
          { error },
          'Ignoring message change as we appear to be processes it in duplicate simultaneously.',
        );
        return;
      }
      throw error;
    }

    // add telemetry for received messages
    this.telemetry.addSpanEvent(SpanEvent.MessageReceived);

    const latencyInSec =
      (new Date().getTime() - new Date(change.message.receivedAt).getTime()) /
      1000;
    if (latencyInSec > this.config.latentMessageThresholdInSec) {
      this.log.warn(
        {
          latentMessage: {
            connectionId: change.connectionId,
            externalThreadId: change.externalThreadId,
            userId: change.userId,
            historyId: change.historyId,
          },
          latency: `${latencyInSec}s`,
        },
        'Latent message.',
      );
    }

    return this.eventBus.publish(
      new EmailMessageCreatedEvent({
        ...newMessage,
        calendarEvent: change.message.calendarEvent,
        isConnectionActive: connection.isActive,
        isBounced: this.google.isBounced(newMessage),
        threadId: thread.threadId,
        connectionId: newMessage.connectionId,
      }),
    );
  }

  private async labelsUpdated(change: MessageChangeInterface): Promise<void> {
    if (change.isNew) return; // newly created messages also look like label updates. ignore them

    let message = await this.messageRepo.findOne({
      externalMessageId: change.message.externalMessageId,
    });

    if (!message) {
      const thread = await this.upsertThread(change);
      message = new HistoryMessageEntity({
        ...change.message,
        thread,
        connection: this.connRepo.getReference(change.message.connectionId),
      });
    }
    await this.em.flush();

    if (change.labelsAdded.length > 0) {
      await this.eventBus.publish(
        new EmailMessageLabelsAddedEvent({
          ...message,
          threadId: message.threadId,
          connectionId: change.connectionId,
          userId: change.userId,
          addedLabels: change.labelsAdded,
        }),
      );
    }
  }

  async execute(command: ProcessMessageChangeCommand): Promise<any> {
    const { change } = command;
    this.log.info({ change }, 'Processing  message change');

    const cacheKey = `gmail-history-${change.historyId}-${change.message.externalMessageId}`;
    try {
      const processed = await getWithDefault(this.cache, {
        key: cacheKey,
        ttl: historyTtl,
        defaultValue: async () => {
          const count = await this.gmailHistoryRepo.count({
            externalHistoryId: change.historyId,
            externalMessageId: change.message.externalMessageId,
          });
          return count || null;
        },
      });

      if (processed) {
        this.log.warn(
          {
            historyId: change.historyId,
            externalMessageId: change.message.externalMessageId,
          },
          'Already processed message change. Skipping',
        );
        return;
      }

      if (isCandidate(change)) {
        if (change.isNew) {
          await this.messageCreated(change);
        }

        if (change.labelsRemoved.length > 0 || change.labelsAdded.length > 0) {
          await this.labelsUpdated(change);
        }
      }

      await this.gmailHistoryRepo.persistAndFlush(
        new GmailHistoryEntity({
          externalMessageId: change.message.externalMessageId,
          externalHistoryId: change.historyId,
        }),
      );
      this.cache.set(cacheKey, 1, { ttl: historyTtl });
    } catch (error) {
      this.log.error({ error, change }, 'Error processing message change');
      throw error;
    }
  }
}
