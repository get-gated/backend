import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { ConnectionAddedEvent } from '@app/events/service-provider/connection-added.event';
import { EventBusService } from '@app/modules/event-bus';
import { BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import ConnectionEntity from '../../entities/connection.entity';
import { ProviderService } from '../../services/provider/provider.service';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { AddConnectionCommand } from './add-connection.command';

export class ConnectionInUseError extends BadRequestException {
  public readonly code = 'CONNECTION_IN_USE';

  constructor() {
    super('Connection in use by other user');
  }
}

export class InsufficientAccessError extends BadRequestException {
  static code = 'INSUFFICIENT_ACCESS';

  constructor() {
    super('Insufficient access granted to provider.');
  }
}

@CommandHandler(AddConnectionCommand)
export class AddConnectionCommandHandler
  implements ICommandHandler<AddConnectionCommand>
{
  constructor(
    private providerService: ProviderService,
    private connectionRepository: ConnectionRepository,
    private eventBus: EventBusService,
    private em: EntityManager,
  ) {}

  async execute(command: AddConnectionCommand): Promise<string> {
    const {
      providerToken,
      provider,
      providerUserId,
      userId,
      legacyConnectionId,
      providerEmailAddress,
    } = command;

    const existing = await this.connectionRepository.findOne({
      providerUserId,
      isDisabled: false,
    });

    if (existing) {
      throw new ConnectionInUseError();
    }

    const connection = new ConnectionEntity({
      userId,
      emailAddress: providerEmailAddress,
      externalAccountId: '',
      externalAccessToken: '',
      provider,
      providerToken,
      providerUserId,
      status: Status.Provisioned,
      legacyConnectionId,
      isDisabled: false,
      isActivated: true,
    });

    const serviceProvider = this.providerService.adapters[provider];

    await serviceProvider.connect(connection);

    try {
      await serviceProvider.checkGatedLabels(connection);
      await serviceProvider.insertLabelInstructions(connection);
      this.connectionRepository.persist(connection); // labels may have been updated

      await this.em.flush();

      await this.eventBus.publish(
        new ConnectionAddedEvent({
          ...connection,
          activate: true,
        }),
      );

      return connection.connectionId;
    } catch (error) {
      await serviceProvider.disconnect(connection); // rollback
      throw error;
    }
  }
}
