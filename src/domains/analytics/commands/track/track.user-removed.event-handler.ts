import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UserRemovedEvent } from '@app/events/user/user-removed.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(UserRemovedEvent, 'analytics-track')
export class TrackUserRemovedEventHandler
  implements IEventHandler<UserRemovedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: UserRemovedEvent): Promise<void> {
    await this.commandBus.execute(
      new TrackCommand(AnalyticEvent.backend_user_Offboard, event.userId, {
        reason: event.reasonText,
        experience: event.experienceText,
      }),
    );
  }
}
