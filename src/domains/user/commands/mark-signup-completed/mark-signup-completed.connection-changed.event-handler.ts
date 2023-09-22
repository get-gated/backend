import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionChangedEvent } from '@app/events/service-provider/connection-changed.event';

import { MarkSignupCompletedCommand } from './mark-signup-completed.command';

@EventHandler(ConnectionChangedEvent, 'user-connection-updated')
export class MarkSignupCompletedConnectionChangedEventHandler
  implements IEventHandler<ConnectionChangedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionChangedEvent): Promise<void> {
    if (!event.isActivated) return;
    await this.commandBus.execute(new MarkSignupCompletedCommand(event.userId));
  }
}
