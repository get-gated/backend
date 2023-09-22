import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionAddedEvent } from '@app/events/service-provider/connection-added.event';

import { LogConnectionChangeCommand } from './log-connection-change.command';

@EventHandler(ConnectionAddedEvent, 'service-provider-log-connection-change')
export class LogConnectionChangeConnectionAddedEventHandler
  implements IEventHandler<ConnectionAddedEvent>
{
  constructor(private commandBus: CommandBus) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handler(event: ConnectionAddedEvent): Promise<any> {
    return this.commandBus.execute(
      new LogConnectionChangeCommand(
        event.connectionId,
        event.status,
        event.isActivated,
      ),
    );
  }
}
