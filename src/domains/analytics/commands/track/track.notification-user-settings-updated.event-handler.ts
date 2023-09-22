import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { NotificationUserSettingsUpdatedEvent } from '@app/events/notification/notification-user-settings-updated.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(NotificationUserSettingsUpdatedEvent, 'analytics-track')
export class TrackNotificationUserSettingsUpdatedEventHandler
  implements IEventHandler<NotificationUserSettingsUpdatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: NotificationUserSettingsUpdatedEvent): Promise<void> {
    await this.commandBus.execute(
      new TrackCommand(
        AnalyticEvent.NotificationUserSettingsUpdated,
        event.userId,
        {
          email: event.email,
        },
      ),
    );
  }
}
