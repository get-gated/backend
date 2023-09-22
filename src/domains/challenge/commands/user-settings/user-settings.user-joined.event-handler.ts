import { Injectable } from '@nestjs/common';
import { UserJoinedEvent } from '@app/events/user/user-joined.event';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { LoggerService } from '@app/modules/logger';

import { UserSettingsCommand } from './user-settings.command';

@EventHandler(UserJoinedEvent, 'challenge-user-settings')
@Injectable()
export default class UserSettingsUserJoinedEventHandler
  implements IEventHandler<UserJoinedEvent>
{
  constructor(private commandBus: CommandBus, private log: LoggerService) {}

  async handler(event: UserJoinedEvent): Promise<void> {
    try {
      const {
        userId,
        firstName,
        defaultMinimumDonationInCents,
        defaultNonprofitId,
      } = event;

      await this.commandBus.execute(
        new UserSettingsCommand(
          userId,
          firstName,
          defaultNonprofitId,
          defaultMinimumDonationInCents,
          true,
        ),
      );
    } catch (error) {
      this.log.fatal(
        { error },
        'Unable to create challenge user settings for new user',
      );
      throw error;
    }
  }
}
