import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConnectionChangedEvent } from '@app/events/service-provider/connection-changed.event';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ConnectionChangedEvent, 'analytics-track')
export class TrackConnectionChangedEventHandler
  implements IEventHandler<ConnectionChangedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionChangedEvent): Promise<void> {
    let eventName: AnalyticEvent;
    switch (event.status) {
      case Status.Initializing:
        eventName = AnalyticEvent.ConnectionInitializing;
        break;
      case Status.Running:
        eventName = AnalyticEvent.ConnectionRunning;
        break;
      case Status.Invalid:
        eventName = AnalyticEvent.ConnectionInvalid;
        break;
      default:
        return;
    }

    await this.commandBus.execute(
      new TrackCommand(eventName, event.userId, {
        connectionId: event.connectionId,
        provider: event.provider,
        emailAddress: event.emailAddress,
        connectionIsActive: event.isActivated,
        connectionStatus: event.status,
      }),
    );
  }
}
