import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionDeactivatedEvent } from '@app/events/service-provider/connection-deactivated.event';

import { LogConnectionChangeCommand } from './log-connection-change.command';

@EventHandler(
  ConnectionDeactivatedEvent,
  'service-provider-log-connection-change',
)
export class LogConnectionChangeConnectionDeactivedEventHandler
  implements IEventHandler<ConnectionDeactivatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handler(event: ConnectionDeactivatedEvent): Promise<any> {
    return this.commandBus.execute(
      new LogConnectionChangeCommand(
        event.connectionId,
        event.status,
        event.isActivated,
      ),
    );
  }
}
