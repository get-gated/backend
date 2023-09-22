import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionActivatedEvent } from '@app/events/service-provider/connection-activated.event';

import { LogConnectionChangeCommand } from './log-connection-change.command';

@EventHandler(
  ConnectionActivatedEvent,
  'service-provider-log-connection-change',
)
export class LogConnectionChangeConnectionActivatedEventHandler
  implements IEventHandler<ConnectionActivatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handler(event: ConnectionActivatedEvent): Promise<any> {
    return this.commandBus.execute(
      new LogConnectionChangeCommand(
        event.connectionId,
        event.status,
        event.isActivated,
      ),
    );
  }
}
