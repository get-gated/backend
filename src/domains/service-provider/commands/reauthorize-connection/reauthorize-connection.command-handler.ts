import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventBusService } from '@app/modules/event-bus';
import { ConnectionChangedEvent } from '@app/events/service-provider/connection-changed.event';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';

import ConnectionRepository from '../../entities/repositories/connection.repository';
import { ProviderService } from '../../services/provider/provider.service';

import { ReauthorizeConnectionCommand } from './reauthorize-connection.command';

@CommandHandler(ReauthorizeConnectionCommand)
export class ReauthorizeConnectionCommandHandler
  implements ICommandHandler<ReauthorizeConnectionCommand>
{
  constructor(
    private readonly eventBus: EventBusService,
    private connectionRepo: ConnectionRepository,
    private providerService: ProviderService,
    private em: EntityManager,
  ) {}

  async execute(command: ReauthorizeConnectionCommand): Promise<void> {
    const {
      userId,
      provider,
      providerToken,
      providerUserId,
      userEmailAddress,
    } = command;

    const connection = await this.connectionRepo.findOneOrFail({
      userId,
      providerUserId,
      provider,
    });
    const serviceProvider = this.providerService.adapters[provider];
    connection.providerToken = providerToken;
    if (userEmailAddress) {
      connection.emailAddress = userEmailAddress;
    }

    await serviceProvider.connect(connection);

    const previousStatus = connection.status;
    connection.status = Status.Running;
    connection.providerUserId = providerUserId;
    connection.updatedAt = new Date();

    await serviceProvider.checkGatedLabels(connection);
    this.connectionRepo.persist(connection);

    const event = new ConnectionChangedEvent({
      ...connection,
      previousStatus,
    });

    await this.em.flush();
    return this.eventBus.publish(event);
  }
}
