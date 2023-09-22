import { EmailMessageCreatedEvent } from '@app/events/service-provider/email-message-created.event';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';

import { EvaluateMessageCommand } from './evaluate-message.command';

@EventHandler(EmailMessageCreatedEvent, 'gatekeeper-evaluate-message-command')
@Injectable()
export default class EvaluateMessageEmailMessageCreatedEventHandler
  implements IEventHandler<EmailMessageCreatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: EmailMessageCreatedEvent): Promise<any> {
    if (event.type !== MessageType.Received) return; // only gatekeep received messages
    if (!event.isConnectionActive) return; // only gatekeep message on active connections;
    if (event.isBounced) return; // this is handled independently
    if (event.wasSentBySystem) return; // we do not need to evaluate system messages
    return this.commandBus.execute(new EvaluateMessageCommand(event));
  }
}
