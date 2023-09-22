import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { NotificationUserSettingsUpdatedEvent } from '@app/events/notification/notification-user-settings-updated.event';

import { IdentifyCommand } from './identify.command';

@EventHandler(NotificationUserSettingsUpdatedEvent, 'analytics-identify')
export class IdentifyNotificationUserSettingsUpdatedEventHandler
  implements IEventHandler<NotificationUserSettingsUpdatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: NotificationUserSettingsUpdatedEvent): Promise<void> {
    await this.commandBus.execute(
      new IdentifyCommand(event.userId, {
        email: event.email,
      }),
    );
  }
}
