import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionActivatedEvent } from '@app/events/service-provider/connection-activated.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ConnectionActivatedEvent, 'analytics-track')
export class TrackConnectionActivatedEventHandler
  implements IEventHandler<ConnectionActivatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionActivatedEvent): Promise<void> {
    await this.commandBus.execute(
      new TrackCommand(AnalyticEvent.ConnectionActivated, event.userId, {
        connectionId: event.connectionId,
        provider: event.provider,
        emailAddress: event.emailAddress,
      }),
    );
  }
}
