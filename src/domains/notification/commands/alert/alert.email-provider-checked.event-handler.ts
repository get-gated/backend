import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConfigType } from '@nestjs/config';
import { EmailProviderCheckedEvent } from '@app/events/service-provider/email-provider-checked.event';

import NotificationConfig from '../../notification.config';

import { AlertCommand } from './alert.command';

@EventHandler(EmailProviderCheckedEvent, 'notification-alert')
@Injectable()
export default class AlertEmailProviderCheckedEventHandler
  implements IEventHandler<EmailProviderCheckedEvent>
{
  constructor(
    private commandBus: CommandBus,
    @Inject(NotificationConfig.KEY)
    private notificationConfig: ConfigType<typeof NotificationConfig>,
  ) {}

  async handler(event: EmailProviderCheckedEvent): Promise<void> {
    const { isGoogle, emailAddress } = event;

    const to = this.notificationConfig.alertAddress.userSignupAttempted;
    if (!to) return;

    const message = `
    <html>
    <p>${emailAddress} (${
      isGoogle ? 'Google' : 'potentially non-Google'
    }) attempted to signup.</p>
   
    </html>
    `;

    await this.commandBus.execute(
      new AlertCommand(to, `New Signup Attempt!`, message),
    );
  }
}
