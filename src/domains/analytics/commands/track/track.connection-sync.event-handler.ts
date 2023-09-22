import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConnectionSyncEvent } from '@app/events/service-provider/connection-sync.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ConnectionSyncEvent, 'analytics-track')
export class TrackConnectionSyncEventHandler
  implements IEventHandler<ConnectionSyncEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionSyncEvent): Promise<void> {
    let eventName: AnalyticEvent;
    if (!event.pageToken) {
      eventName = AnalyticEvent.ConnectionSyncStarted;
    } else if (event.isFinished) {
      eventName = AnalyticEvent.ConnectionSyncFinished;
    } else {
      return;
    }

    await this.commandBus.execute(
      new TrackCommand(eventName, event.connection.userId, {
        connectionId: event.connectionId,
        provider: event.connection.provider,
        emailAddress: event.connection.emailAddress,
        connectionIsActive: event.connection.isActivated,
        connectionStatus: event.connection.status,
      }),
    );
  }
}
