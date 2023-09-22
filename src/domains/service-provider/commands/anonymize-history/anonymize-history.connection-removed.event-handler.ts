import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionRemovedEvent } from '@app/events/service-provider/connection-removed.event';

import { AnonymizeHistoryCommand } from './anonymize-history.command';

@EventHandler(ConnectionRemovedEvent, 'service-provider-anonymize-history')
export class AnonymizeHistoryConnectionRemovedEventHandler
  implements IEventHandler<ConnectionRemovedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionRemovedEvent): Promise<any> {
    return this.commandBus.execute(
      new AnonymizeHistoryCommand(event.userId, event.connectionId),
    );
  }
}
