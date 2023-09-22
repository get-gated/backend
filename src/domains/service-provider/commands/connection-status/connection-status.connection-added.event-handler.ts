import { CommandBus } from '@nestjs/cqrs';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { ConnectionAddedEvent } from '@app/events/service-provider/connection-added.event';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';

import { ConnectionStatusCommand } from './connection-status.command';

/** **
 * Transition connection to running when added to the system. Previously, connection status
 * started out as provisioned and transitioned to running only after syncing was completed.
 * This maintains backward compatibility with subscribers that watch for transition of
 * connection status to RUNNING.
 */
@EventHandler(ConnectionAddedEvent, 'service-provider-connection-status')
export class ConnectionStatusConnectionAddedEventHandler
  implements IEventHandler<ConnectionAddedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionAddedEvent): Promise<void> {
    await this.commandBus.execute(
      new ConnectionStatusCommand(event.connectionId, Status.Running),
    );
  }
}
