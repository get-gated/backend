import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConnectionAddedEvent } from '@app/events/service-provider/connection-added.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ConnectionAddedEvent, 'analytics-track')
export class TrackConnectionAddedEventHandler
  implements IEventHandler<ConnectionAddedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionAddedEvent): Promise<void> {
    await this.commandBus.execute(
      new TrackCommand(AnalyticEvent.backend_user_AddAddress, event.userId, {
        connectionId: event.connectionId,
        provider: event.provider,
        emailAddress: event.emailAddress,
        connectionIsActive: event.isActivated,
        connectionStatus: event.status,
        // May need account type: private vs corporate
      }),
    );
  }
}
