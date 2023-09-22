import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { ConnectionChangedEvent } from '@app/events/service-provider/connection-changed.event';
import { EventBusService } from '@app/modules/event-bus';
import { LoggerService } from '@app/modules/logger';

import ConnectionRepository from '../../entities/repositories/connection.repository';

import { ConnectionStatusCommand } from './connection-status.command';

@CommandHandler(ConnectionStatusCommand)
export class ConnectionStatusHandler
  implements ICommandHandler<ConnectionStatusCommand>
{
  constructor(
    private readonly eventBus: EventBusService,
    private readonly em: EntityManager,
    private readonly connectionRepository: ConnectionRepository,
    private log: LoggerService,
  ) {}

  async execute(command: ConnectionStatusCommand): Promise<any> {
    try {
      const { connectionId } = command;

      // get connection details
      const connection = await this.connectionRepository.findOneOrFail({
        connectionId,
      });

      // don't update status if it hasnt changed.
      if (connection.status === command.status) return;

      const previousStatus = connection.status;

      // update the connection status
      connection.status = command.status;
      connection.updatedAt = new Date();
      this.connectionRepository.persist(connection);

      // create event
      const event = new ConnectionChangedEvent({
        ...connection,
        previousStatus,
      });

      this.log.info(
        { connectionId },
        `Updating connection status to ${command.status}`,
      );
      await this.em.flush(); // persist all data
      return this.eventBus.publish(event);
    } catch (error) {
      this.log.error({ error }, 'Error execution connection updated handler.');
    }
  }
}
