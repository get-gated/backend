import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { UserSignupCompletedEvent } from '@app/events/user/user-signup-completed.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(UserSignupCompletedEvent, 'analytics-track')
export class TrackUserSignupCompletedEventHandler
  implements IEventHandler<UserSignupCompletedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: UserSignupCompletedEvent): Promise<void> {
    const eventName = AnalyticEvent.backend_user_SignupComplete;

    await this.commandBus.execute(
      new TrackCommand(eventName, event.userId, {
        userId: event.userId,
        isSignupCompleted: event.isSignupCompleted,
        joinedAt: event.joinedAt,
        firstName: event.firstName,
        lastName: event.lastName,
        fullName: event.fullName,
        roles: event.roles,
      }),
    );
  }
}
