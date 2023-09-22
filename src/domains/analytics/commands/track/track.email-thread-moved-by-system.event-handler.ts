import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConnectionEmailThreadMovedBySystemEvent } from '@app/events/service-provider/email-thread-moved-by-system.event';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ConnectionEmailThreadMovedBySystemEvent, 'analytics-track')
export class TrackConnectionEmailThreadMovedBySystemEventHandler
  implements IEventHandler<ConnectionEmailThreadMovedBySystemEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionEmailThreadMovedBySystemEvent): Promise<void> {
    let eventName: AnalyticEvent;
    if (event.destination === Label.Gated) {
      eventName = AnalyticEvent.backend_gatekeeper_MoveToGated;
    } else {
      eventName = AnalyticEvent.backend_gatekeeper_MoveToInbox;
    }

    await this.commandBus.execute(
      new TrackCommand(eventName, event.userId, {
        connectionId: event.connectionId,
        threadId: event.threadId,
        userId: event.userId,
        moveDestination: event.destination,
      }),
    );
  }
}
