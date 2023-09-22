import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cache } from 'cache-manager';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { UserTask } from '@app/interfaces/user/user.enums';
import { EventHandler } from '@app/modules/event-bus';
import { LoggerService } from '@app/modules/logger';
import { UserTaskPendingEvent } from '@app/events/user/user-task-pending.event';
import {
  ConcurrentProcessingError,
  getCacheLock,
  Lock,
} from '@app/modules/cache/cache-lock.service';
import { Maybe } from '@app/modules/utils';

import { TxEmailService } from '../../services/tx-email/tx-email.service';

import SendTxEmailCommand from './send-tx-email.command';

@EventHandler(UserTaskPendingEvent, 'notification-send-tx-email')
@Injectable()
export default class SendTxEmailUserTaskPendingEventHandler {
  constructor(
    private commandBus: CommandBus,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private log: LoggerService,
    private txEmailService: TxEmailService,
  ) {}

  async handler(event: UserTaskPendingEvent): Promise<any> {
    const { userId } = event;
    if (event.task !== UserTask.ConnectFirstAccount) {
      return;
    }

    const cacheKey = `tx-email-user-task-pending-${userId}`;
    let cacheLock: Maybe<Lock>;

    try {
      cacheLock = await getCacheLock({
        cache: this.cache,
        cacheKey,
        ttl: 2000,
      });
      const variables = {
        ...(await this.txEmailService.getVariables({ userId })),
        task: event.task,
      };

      return this.commandBus.execute(
        new SendTxEmailCommand(
          userId,
          variables.userEmailAddress,
          variables.userFullName,
          Transaction.PendingFirstConnection,
          variables,
          userId,
        ),
      );
    } catch (error) {
      if (error instanceof ConcurrentProcessingError) {
        this.log.warn(
          { userId },
          'Currently processing user task pending event. Ignoring.',
        );
        return;
      }

      this.log.error(
        { error },
        'Error sending tx emails on user task pending event',
      );
      throw error;
    } finally {
      await cacheLock?.clear();
    }
  }
}
