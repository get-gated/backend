import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { EmailMessageCreatedEvent } from '@app/events/service-provider/email-message-created.event';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AllowThreadReason } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';

import { AllowThreadCommand } from './allow-thread.command';

/**
 * @name AllowThreadEmailMessageCreatedEventHandler
 * @description
 * Watch for email messages created by the user
 * and mark the thread as allowed so that all
 * future replies to the thread can be allowed
 * regardless of trainings.
 */
@EventHandler(EmailMessageCreatedEvent, 'gatekeeper-allow-thread')
@Injectable()
export default class AllowThreadEmailMessageCreatedEventHandler
  implements IEventHandler<EmailMessageCreatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: EmailMessageCreatedEvent): Promise<void> {
    if (event.type !== MessageType.Sent) return;
    if (event.wasSentBySystem === true) return;

    await this.commandBus.execute(
      new AllowThreadCommand(
        event.threadId,
        AllowThreadReason.UserParticipatingOn,
      ),
    );
  }
}
