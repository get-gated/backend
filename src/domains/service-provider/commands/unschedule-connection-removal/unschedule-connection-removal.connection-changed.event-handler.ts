import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConnectionChangedEvent } from '@app/events/service-provider/connection-changed.event';
import { CommandBus } from '@nestjs/cqrs';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';

import { UnscheduleConnectionRemovalCommand } from './unschedule-connection-removal.command';

@EventHandler(
  ConnectionChangedEvent,
  'service-provider-unschedule-connection-removal',
)
export class UnscheduleConnectionRemovalConnectionChangedEventHandler
  implements IEventHandler<ConnectionChangedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionChangedEvent): Promise<any> {
    const { status, connectionId, previousStatus } = event;

    if (status !== Status.Running && previousStatus !== Status.Invalid) return;
    return this.commandBus.execute(
      new UnscheduleConnectionRemovalCommand(connectionId),
    );
  }
}
