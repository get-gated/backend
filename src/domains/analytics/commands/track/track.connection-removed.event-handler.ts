import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConnectionRemovedEvent } from '@app/events/service-provider/connection-removed.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ConnectionRemovedEvent, 'analytics-track')
export class TrackConnectionRemovedEventHandler
  implements IEventHandler<ConnectionRemovedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionRemovedEvent): Promise<void> {
    await this.commandBus.execute(
      new TrackCommand(AnalyticEvent.backend_user_RemoveAddress, event.userId, {
        connectionId: event.connectionId,
        provider: event.provider,
        reason: event.reasonText,
        experience: event.experienceText,
      }),
    );
  }
}
