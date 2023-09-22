import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UserJoinedEvent } from '@app/events/user/user-joined.event';

import { IdentifyCommand } from './identify.command';

@EventHandler(UserJoinedEvent, 'analytics-identify')
export class IdentifyUserJoinedEventHandler
  implements IEventHandler<UserJoinedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: UserJoinedEvent): Promise<void> {
    await this.commandBus.execute(
      new IdentifyCommand(event.userId, {
        firstName: event.firstName,
        lastName: event.lastName,
        fullName: event.fullName,
        emailAddress: event.joinedWithEmail,
        email: event.joinedWithEmail,
        avatar: event.avatar,
        referredByUserId: event.referredByUserId,
        referralCode: event.referralCode,
      }),
    );
  }
}
