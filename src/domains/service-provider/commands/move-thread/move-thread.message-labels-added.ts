import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';
import { EmailMessageLabelsAddedEvent } from '@app/events/service-provider/email-message-labels-added.event';

import { MoveThreadCommand } from './move-thread.command';

@EventHandler(EmailMessageLabelsAddedEvent, 'service-provider-move-thread')
export default class MoveThreadMessageLabelsAdded
  implements IEventHandler<EmailMessageLabelsAddedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: EmailMessageLabelsAddedEvent): Promise<void> {
    if (!event.threadId) {
      return;
    }

    if (event.addedLabels.includes(Label.TrainAsGated)) {
      await this.commandBus.execute(
        new MoveThreadCommand(event.connectionId, event.threadId, Label.Gated),
      );
      return;
    }

    if (event.addedLabels.includes(Label.TrainAsAllowed)) {
      await this.commandBus.execute(
        new MoveThreadCommand(event.connectionId, event.threadId, Label.Inbox),
      );
    }
  }
}
