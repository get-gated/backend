import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { ConnectionActivatedEvent } from '@app/events/service-provider/connection-activated.event';

import ConnectionRepository from '../../entities/repositories/connection.repository';

import { ActivateConnectionCommand } from './activate-connection.command';

@CommandHandler(ActivateConnectionCommand)
export class ActivateConnectionCommandHandler
  implements ICommandHandler<ActivateConnectionCommand>
{
  constructor(
    private connectionRepo: ConnectionRepository,
    private eventBus: EventBusService,
  ) {}

  async execute(command: ActivateConnectionCommand): Promise<void> {
    const connection = await this.connectionRepo.findOneOrFail(
      command.connectionId,
    );
    if (connection.isActivated) {
      return;
    }

    connection.isActivated = true;
    connection.updatedAt = new Date();

    await this.connectionRepo.persistAndFlush(connection);

    await this.eventBus.publish(new ConnectionActivatedEvent(connection));
  }
}
