import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UserJoinedEvent } from '@app/events/user/user-joined.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(UserJoinedEvent, 'analytics-track')
export class TrackUserJoinedEventHandler
  implements IEventHandler<UserJoinedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: UserJoinedEvent): Promise<void> {
    await this.commandBus.execute(
      new TrackCommand(AnalyticEvent.backend_user_JoinedGated, event.userId, {
        firstName: event.firstName,
        lastName: event.lastName,
        fullName: event.fullName,
        emailAddress: event.joinedWithEmail,
      }),
    );
  }
}
