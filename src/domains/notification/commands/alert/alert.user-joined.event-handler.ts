import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConfigType } from '@nestjs/config';
import { UserJoinedEvent } from '@app/events/user/user-joined.event';

import NotificationConfig from '../../notification.config';

import { AlertCommand } from './alert.command';

@EventHandler(UserJoinedEvent, 'notification-alert')
@Injectable()
export default class AlertUserJoinedEventHandler
  implements IEventHandler<UserJoinedEvent>
{
  constructor(
    private commandBus: CommandBus,
    @Inject(NotificationConfig.KEY)
    private notificationConfig: ConfigType<typeof NotificationConfig>,
  ) {}

  async handler(event: UserJoinedEvent): Promise<void> {
    const { userId, fullName, joinedWithEmail, joinedAt, referredByUserId } =
      event;

    const to = this.notificationConfig.alertAddress.userJoined;

    if (!to) return;

    const message = `
    <html>
      <p>${fullName} (${joinedWithEmail}) joined Gated at ${joinedAt.toLocaleString(
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
        ${
          referredByUserId
            ? `<li>referredByUserId: ${referredByUserId}</li>`
            : ''
        }
      </ul> 
    </html>
    `;

    let subject = `${fullName} Joined Gated!`;
    if (referredByUserId) {
      subject = `${subject} 👩🏼‍❤️‍👨🏻`;
    }

    await this.commandBus.execute(new AlertCommand(to, subject, message));
  }
}
