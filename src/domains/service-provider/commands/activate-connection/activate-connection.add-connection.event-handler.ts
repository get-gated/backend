import { Injectable } from '@nestjs/common';
import { ConnectionAddedEvent } from '@app/events/service-provider/connection-added.event';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';

import { ActivateConnectionCommand } from './activate-connection.command';

@EventHandler(ConnectionAddedEvent, 'activate-connection-add-connection')
@Injectable()
export default class ActivateConnectionAddConnectionEventHandler
  implements IEventHandler<ConnectionAddedEvent>
{
  constructor(private commandBus: CommandBus) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handler(event: ConnectionAddedEvent): Promise<any | undefined> {
    if (event.activate) {
      return this.commandBus.execute(
        new ActivateConnectionCommand(event.connectionId),
      );
    }
  }
}
