import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionAddedEvent } from '@app/events/service-provider/connection-added.event';

import { MarkSignupCompletedCommand } from './mark-signup-completed.command';

@EventHandler(ConnectionAddedEvent, 'user-connection-updated')
export class MarkSignupCompletedConnectionAddedEventHandler
  implements IEventHandler<ConnectionAddedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionAddedEvent): Promise<void> {
    if (!event.isActivated) return;
    await this.commandBus.execute(new MarkSignupCompletedCommand(event.userId));
  }
}
