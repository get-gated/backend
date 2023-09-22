import { CommandBus } from '@nestjs/cqrs';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { Provider } from '@app/interfaces/service-provider/service-provider.enums';
import { LoggerService } from '@app/modules/logger';
import { AsyncContextService } from '@app/modules/async-context';
import { Maybe, UtilsService } from '@app/modules/utils';

import { GmailPushNotificationEvent } from '../../events/gmail-push-notification.event';
import ConnectionRepository from '../../entities/repositories/connection.repository';
import ConnectionEntity from '../../entities/connection.entity';

import { ProcessGmailHistoryCommand } from './process-gmail-history.command';
import { getLastHistoryIdCacheKey, isGreater } from './util';

@EventHandler(
  GmailPushNotificationEvent,
  'service-provider-process-gmail-push-notification',
  {
    ackDeadline: 30,
    flowControl: {
      maxExtensionMinutes: 10,
    },
  },
)
export class ProcessGmailHistoryGmailPushNotificationEventHandler
  implements IEventHandler<GmailPushNotificationEvent>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly connRepo: ConnectionRepository,
    private readonly log: LoggerService,
    private readonly ac: AsyncContextService,
    private readonly utils: UtilsService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  private async getConnection(
    emailAddress: string,
  ): Promise<Maybe<ConnectionEntity>> {
    let connection = await this.connRepo.findOne({
      emailAddress: { $ilike: emailAddress },
      provider: Provider.Google,
    });

    if (!connection) {
      // check if this is a deleted connection
      const hashedEmail = this.utils.createHash(emailAddress.toLowerCase());
      connection = await this.connRepo.findOne({
        emailAddress: hashedEmail,
        provider: Provider.Google,
      });
    }

    if (!connection) {
      this.log.warn(
        { emailAddress },
        'Received push notification for unknown connection.',
      );
      return null;
    }
    return connection;
  }

  private getCachedLastHistoryId(emailAddress: string): Promise<Maybe<string>> {
    return this.cache.get(getLastHistoryIdCacheKey(emailAddress));
  }

  async handler({
    historyId,
    emailAddress,
  }: GmailPushNotificationEvent): Promise<void> {
    this.log.info(
      { historyId, emailAddress },
      'Received gmail push notification',
    );

    let lastHistoryId = await this.getCachedLastHistoryId(emailAddress);
    if (isGreater(lastHistoryId, historyId)) {
      this.log.info(
        { emailAddress, lastHistoryId, historyId },
        'History ID old based on cache. Skipping',
      );
      return;
    }

    const connection = await this.getConnection(emailAddress);
    if (!connection) {
      return;
    }
    lastHistoryId = connection.lastHistoryId;

    this.ac.set('userId', connection.userId);
    this.ac.set('connectionId', connection.connectionId);

    if (connection.deletedAt) {
      return;
    }

    if (isGreater(lastHistoryId, historyId)) {
      this.log.info({ lastHistoryId, historyId }, 'History ID old. Skipping');
      return;
    }

    await this.commandBus.execute(
      new ProcessGmailHistoryCommand(connection.connectionId, historyId),
    );
  }
}
