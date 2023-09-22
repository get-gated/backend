import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UserJoinedEvent } from '@app/events/user/user-joined.event';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserSettingsCommand } from './update-user-settings.command';

@EventHandler(UserJoinedEvent, 'notification-update-user-settings')
export class UpdateUserSettingsUserJoinedEventHandler
  implements IEventHandler<UserJoinedEvent>
{
  constructor(private commandBus: CommandBus) {}
  async handler(event: UserJoinedEvent) {
    await this.commandBus.execute(
      new UpdateUserSettingsCommand(event.userId, event.joinedWithEmail),
    );
  }
}
