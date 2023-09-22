import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { EmailMessageCreatedEvent } from '@app/events/service-provider/email-message-created.event';
import { CommandBus } from '@nestjs/cqrs';

import { TrackSentReceivedCommand } from './track-sent-received.command';

@EventHandler(EmailMessageCreatedEvent, 'track-sent-received')
export class TrackSentReceivedMessageCreatedEventHandler
  implements IEventHandler<EmailMessageCreatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: EmailMessageCreatedEvent): Promise<void> {
    await this.commandBus.execute(new TrackSentReceivedCommand(event));
  }
}
