import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { UserUpdatedEvent } from '@app/events/user/user-updated.event';

import { IdentifyCommand } from './identify.command';

@EventHandler(UserUpdatedEvent, 'analytics-identify')
export class IdentifyUserUpdatedEventHandler
  implements IEventHandler<UserUpdatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: UserUpdatedEvent): Promise<void> {
    await this.commandBus.execute(
      new IdentifyCommand(event.userId, {
        firstName: event.firstName,
        lastName: event.lastName,
        avatar: event.avatar,
        referralCode: event.referralCode,
      }),
    );
  }
}
