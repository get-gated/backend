import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConfigType } from '@nestjs/config';
import { UserRemovedEvent } from '@app/events/user/user-removed.event';

import NotificationConfig from '../../notification.config';

import { AlertCommand } from './alert.command';

@EventHandler(UserRemovedEvent, 'notification-alert')
@Injectable()
export default class AlertUserRemovedEventHandler
  implements IEventHandler<UserRemovedEvent>
{
  constructor(
    private commandBus: CommandBus,
    @Inject(NotificationConfig.KEY)
    private notificationConfig: ConfigType<typeof NotificationConfig>,
  ) {}

  async handler(event: UserRemovedEvent): Promise<void> {
    const { userId, fullName, reasonText, experienceText } = event;

    const to = this.notificationConfig.alertAddress.userOffboarded;

    if (!to) return;

    const message = `
    <html lang="en-US">
      <p>${fullName} deleted their Gated Account at ${new Date().toLocaleString(
      'en-US',
      {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      },
    )}.</p>
      <strong>Gated System IDs</strong>
      <ul>
        <li>userId: ${userId}</li>
      </ul> 
      <strong>Questionnaire Response</strong>
      <ul>
        <li>reason: ${reasonText}</li>
        <li>experience: ${experienceText}</li>
      </ul> 
    </html>
    `;

    await this.commandBus.execute(
      new AlertCommand(to, `${fullName} Offboarded from Gated`, message),
    );
  }
}
