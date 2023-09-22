import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionChangedEvent } from '@app/events/service-provider/connection-changed.event';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { EventHandler } from '@app/modules/event-bus';
import { Cache } from 'cache-manager';
import { LoggerService } from '@app/modules/logger';

import {
  TxEmailService,
  TxTemplateVariables,
} from '../../services/tx-email/tx-email.service';
import TxEmailEntity from '../../entities/tx-email.entity';

import SendTxEmailCommand from './send-tx-email.command';

@EventHandler(ConnectionChangedEvent, 'notification-send-tx-email')
@Injectable()
export default class SendTxEmailConnectionChangedEventHandler {
  constructor(
    @InjectRepository(TxEmailEntity)
    private emailRepo: EntityRepository<TxEmailEntity>,
    private commandBus: CommandBus,
    private txEmailService: TxEmailService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private log: LoggerService,
  ) {}

  async handler(event: ConnectionChangedEvent): Promise<any> {
    const {
      userId,
      status,
      previousStatus,
      emailAddress,
      provider,
      connectionId,
    } = event;

    // prevent duplicate processing;
    const cacheKey = `tx-email-connection-changed-subscriber-${connectionId}`;
    const exists = await this.cache.get(cacheKey);
    if (exists) {
      this.log.warn(
        { connectionId },
        'Currently processing connection change event with this ID. Ignoring.',
      );
      return;
    }
    await this.cache.set(cacheKey, true, { ttl: 2 });
    const releaseCache = (): Promise<any> => this.cache.del(cacheKey);

    const getVariables = async (): Promise<TxTemplateVariables> => {
      const vars = await this.txEmailService.getVariables({ userId });

      return {
        ...vars,
        connectionProvider: provider,
        connectionEmail: emailAddress,
      };
    };

    try {
      if (
        status === Status.Invalid &&
        [Status.Running, Status.Provisioned, Status.Initializing].includes(
          previousStatus,
        )
      ) {
        const variables = await getVariables();
        return this.commandBus.execute(
          new SendTxEmailCommand(
            userId,
            emailAddress,
            variables.userFullName,
            Transaction.ConnectionStopped,
            variables,
            event.updatedAt?.toISOString(),
          ),
        );
      }

      if (
        [Status.Running, Status.Provisioned, Status.Initializing].includes(
          status,
        ) &&
        previousStatus === Status.Invalid
      ) {
        const sentForConnection = await this.emailRepo.findOne({
          userId,
          uniqueId: connectionId,
        });

        if (sentForConnection) {
          this.log.info(
            'Already sent tx email for adding this connection. Skipping.',
          );
          return;
        }

        const variables = await getVariables();
        return this.commandBus.execute(
          new SendTxEmailCommand(
            userId,
            emailAddress,
            variables.userFullName,
            Transaction.ConnectionResumed,
            variables,
          ),
        );
      }

      if (
        status === Status.Running &&
        [Status.Initializing, Status.Provisioned].includes(previousStatus)
      ) {
        const variables = await getVariables();
        const hasFirstConnection = await this.emailRepo.findOne({
          transaction: Transaction.FirstConnectionReady,
          userId,
        });
        const transaction = hasFirstConnection
          ? Transaction.ConnectionReady
          : Transaction.FirstConnectionReady;
        return this.commandBus.execute(
          new SendTxEmailCommand(
            userId,
            emailAddress,
            variables.userFullName,
            transaction,
            variables,
            connectionId,
          ),
        );
      }
    } catch (error) {
      this.log.error(
        { error },
        'Error sending tx emails on connection changed event',
      );
      throw error;
    } finally {
      await releaseCache();
    }
  }
}
