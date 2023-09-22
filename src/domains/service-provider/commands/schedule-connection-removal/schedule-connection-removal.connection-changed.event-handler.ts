import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConnectionChangedEvent } from '@app/events/service-provider/connection-changed.event';
import { CommandBus } from '@nestjs/cqrs';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';

import { ScheduleConnectionRemovalCommand } from './schedule-connection-removal.command';

@EventHandler(
  ConnectionChangedEvent,
  'service-provider-schedule-connection-removal',
)
export class ScheduleConnectionRemovalConnectionChangedEventHandler
  implements IEventHandler<ConnectionChangedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionChangedEvent): Promise<void> {
    const { status, connectionId } = event;

    if (status !== Status.Invalid) return;
    return this.commandBus.execute(
      new ScheduleConnectionRemovalCommand(connectionId),
    );
  }
}
