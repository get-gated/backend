import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionRemovedEvent } from '@app/events/service-provider/connection-removed.event';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { EventHandler } from '@app/modules/event-bus';
import { Cache } from 'cache-manager';
import { LoggerService } from '@app/modules/logger';
import { ConnectionRemovedTrigger } from '@app/interfaces/service-provider/service-provider.enums';

import {
  TxEmailService,
  TxTemplateVariables,
} from '../../services/tx-email/tx-email.service';

import SendTxEmailCommand from './send-tx-email.command';

@EventHandler(ConnectionRemovedEvent, 'notification-send-tx-email')
@Injectable()
export default class SendTxEmailConnectionRemovedEventHandler {
  constructor(
    private commandBus: CommandBus,
    private txEmailService: TxEmailService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private log: LoggerService,
  ) {}

  async handler(event: ConnectionRemovedEvent): Promise<any> {
    const {
      userId,
      emailAddress,
      provider,
      connectionId,
      trigger,
      reasonText,
      experienceText,
    } = event;

    // prevent email upon user account removal
    if (trigger === ConnectionRemovedTrigger.AccountRemoval) return;

    // prevent duplicate processing;
    const cacheKey = `tx-email-connection-removed-subscriber-${connectionId}`;
    const exists = await this.cache.get(cacheKey);
    if (exists) {
      this.log.warn(
        { connectionId },
        'Currently processing connection removed event with this ID. Ignoring.',
      );
      return;
    }
    await this.cache.set(cacheKey, true, { ttl: 2000 });
    const releaseCache = (): Promise<any> => this.cache.del(cacheKey);

    const getVariables = async (): Promise<TxTemplateVariables> => {
      const vars = await this.txEmailService.getVariables({ userId });

      return {
        ...vars,
        connectionProvider: provider,
        connectionEmail: emailAddress,
        reasonText,
        experienceText,
      };
    };

    try {
      const variables = await getVariables();
      return this.commandBus.execute(
        new SendTxEmailCommand(
          userId,
          emailAddress,
          variables.userFullName,
          Transaction.ConnectionRemoved,
          variables,
          connectionId,
        ),
      );
    } catch (error) {
      this.log.error(
        { error },
        'Error sending tx emails on connection removed event',
      );
      throw error;
    } finally {
      await releaseCache();
    }
  }
}
