import { EventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { UserRemovedEvent } from '@app/events/user/user-removed.event';

import { DeleteSentReceivedCommand } from './delete-sent-received.command';

@EventHandler(UserRemovedEvent, 'service-provider-delete-sent-received')
export class DeleteSentReceivedConnectionRemovedEventHandler {
  constructor(private commandBus: CommandBus) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handler(event: UserRemovedEvent): Promise<any> {
    return this.commandBus.execute(new DeleteSentReceivedCommand(event.userId));
  }
}
