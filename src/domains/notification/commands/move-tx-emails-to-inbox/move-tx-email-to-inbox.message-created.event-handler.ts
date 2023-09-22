import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { EmailMessageCreatedEvent } from '@app/events/service-provider/email-message-created.event';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';

import NotificationConfig from '../../notification.config';

import { MoveTxEmailToInboxCommand } from './move-tx-email-to-inbox.command';

@EventHandler(EmailMessageCreatedEvent, 'notification-move-tx-email-to-inbox')
export default class MoveTxEmailToInboxMessageCreatedEventHandler
  implements IEventHandler<EmailMessageCreatedEvent>
{
  constructor(
    private commandBus: CommandBus,
    @Inject(NotificationConfig.KEY)
    private notificationConfig: ConfigType<typeof NotificationConfig>,
  ) {}

  async handler(event: EmailMessageCreatedEvent): Promise<void> {
    if (
      event.from.emailAddress.toLowerCase() ===
      this.notificationConfig.txEmailFromAddress.toLowerCase()
    ) {
      await this.commandBus.execute(
        new MoveTxEmailToInboxCommand(event.connectionId, event.threadId),
      );
    }
  }
}
