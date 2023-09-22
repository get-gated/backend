import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { ConnectionDeactivatedEvent } from '@app/events/service-provider/connection-deactivated.event';

import ConnectionRepository from '../../entities/repositories/connection.repository';

import { DeactivateConnectionCommand } from './deactivate-connection.command';

@CommandHandler(DeactivateConnectionCommand)
export class DeactivateConnectionCommandHandler
  implements ICommandHandler<DeactivateConnectionCommand>
{
  constructor(
    private connectionRepo: ConnectionRepository,
    private eventBus: EventBusService,
  ) {}

  async execute(command: DeactivateConnectionCommand): Promise<void> {
    const connection = await this.connectionRepo.findOneOrFail(
      command.connectionId,
    );
    if (!connection.isActivated) {
      return;
    }

    connection.isActivated = false;
    connection.updatedAt = new Date();

    await this.connectionRepo.persistAndFlush(connection);

    await this.eventBus.publish(new ConnectionDeactivatedEvent(connection));
  }
}
