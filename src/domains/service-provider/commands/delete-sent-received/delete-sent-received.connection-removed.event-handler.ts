import { EventHandler } from '@app/modules/event-bus';
import { ConnectionRemovedEvent } from '@app/events/service-provider/connection-removed.event';
import { CommandBus } from '@nestjs/cqrs';

import { DeleteSentReceivedCommand } from './delete-sent-received.command';

@EventHandler(ConnectionRemovedEvent, 'service-provider-delete-sent-received')
export class DeleteSentReceivedConnectionRemovedEventHandler {
  constructor(private commandBus: CommandBus) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handler(event: ConnectionRemovedEvent): Promise<any> {
    return this.commandBus.execute(
      new DeleteSentReceivedCommand(event.userId, event.connectionId),
    );
  }
}
