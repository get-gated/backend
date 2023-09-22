import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { EmailMessageChangedEvent } from '@app/events/service-provider/email-message-changed.event';
import { CommandBus } from '@nestjs/cqrs';

import { ProcessMessageChangeCommand } from './process-message-change.command';

@EventHandler(EmailMessageChangedEvent, 'process-message-change')
export class ProcessMessageChangeEmailMessageChangedEventHandler
  implements IEventHandler<EmailMessageChangedEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  async handler(event: EmailMessageChangedEvent): Promise<void> {
    await this.commandBus.execute(new ProcessMessageChangeCommand(event));
  }
}
