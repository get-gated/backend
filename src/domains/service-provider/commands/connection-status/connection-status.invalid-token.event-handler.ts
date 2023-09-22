import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';

import { InvalidTokenEvent } from '../../events/invalid-token.event';

import { ConnectionStatusCommand } from './connection-status.command';

@EventHandler(InvalidTokenEvent, 'service-provider-connection-status')
export class ConnectionStatusInvalidTokenEventHandler
  implements IEventHandler<InvalidTokenEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  async handler(event: InvalidTokenEvent): Promise<void> {
    await this.commandBus.execute(
      new ConnectionStatusCommand(event.connectionId, Status.Invalid),
    );
  }
}
