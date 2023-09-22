import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserRemovedEvent } from '@app/events/user/user-removed.event';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { EventHandler } from '@app/modules/event-bus';
import { Cache } from 'cache-manager';
import { LoggerService } from '@app/modules/logger';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import UserSettingsEntity from '../../entities/user-settings.entity';
import { TxTemplateVariables } from '../../services/tx-email/tx-email.service';

import SendTxEmailCommand from './send-tx-email.command';

@EventHandler(UserRemovedEvent, 'notification-send-tx-email')
@Injectable()
export default class SendTxEmailUserRemovedEventHandler {
  constructor(
    private commandBus: CommandBus,
    @InjectRepository(UserSettingsEntity)
    private userSettingRepo: EntityRepository<UserSettingsEntity>,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private log: LoggerService,
  ) {}

  async handler(event: UserRemovedEvent): Promise<void> {
    const { userId, reasonText, experienceText } = event;

    // prevent duplicate processing;
    const cacheKey = `tx-email-user-removed-subscriber-${userId}`;
    const exists = await this.cache.get(cacheKey);
    if (exists) {
      this.log.warn(
        { userId },
        'Currently processing user removed event with this ID. Ignoring.',
      );
      return;
    }
    await this.cache.set(cacheKey, true, { ttl: 2000 });
    const releaseCache = (): Promise<void> => this.cache.del(cacheKey);

    const settings = await this.userSettingRepo.findOneOrFail({
      userId,
    });

    const getVariables = async (): Promise<TxTemplateVariables> => ({
      userAvatar: event.avatar,
      userFirstName: event.firstName,
      userLastName: event.lastName,
      userFullName: event.fullName,
      userEmailAddress: settings.email,
      userReferralCode: event.referralCode,
      userHandle: event.handle,
      reasonText,
      experienceText,
    });

    try {
      const variables = await getVariables();
      await this.commandBus.execute(
        new SendTxEmailCommand(
          userId,
          variables.userEmailAddress,
          variables.userFullName,
          Transaction.AccountRemoved,
          variables,
          userId,
        ),
      );
    } catch (error) {
      this.log.error(
        { error },
        'Error sending tx emails on user removed event',
      );
      throw error;
    } finally {
      await releaseCache();
    }
  }
}
