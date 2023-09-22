import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConnectionRemovedEvent } from '@app/events/service-provider/connection-removed.event';
import { CommandBus } from '@nestjs/cqrs';

import { LogConnectionChangeCommand } from './log-connection-change.command';

@EventHandler(ConnectionRemovedEvent, 'service-provider-log-connection-change')
export class LogConnectionChangeConnectionRemovedEventHandler
  implements IEventHandler<ConnectionRemovedEvent>
{
  constructor(private commandBus: CommandBus) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handler(event: ConnectionRemovedEvent): Promise<any> {
    return this.commandBus.execute(
      new LogConnectionChangeCommand(
        event.connectionId,
        event.status,
        event.isActivated,
      ),
    );
  }
}
