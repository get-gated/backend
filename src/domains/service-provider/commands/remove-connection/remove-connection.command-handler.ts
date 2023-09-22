import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { ConnectionRemovedEvent } from '@app/events/service-provider/connection-removed.event';
import { UtilsService } from '@app/modules/utils';

import { ProviderService } from '../../services/provider/provider.service';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { RemoveConnectionCommand } from './remove-connection.command';

@CommandHandler(RemoveConnectionCommand)
export class RemoveConnectionCommandHandler
  implements ICommandHandler<RemoveConnectionCommand>
{
  constructor(
    private connectionRepo: ConnectionRepository,
    private provider: ProviderService,
    private eventBus: EventBusService,
    private utils: UtilsService,
  ) {}

  async execute(command: RemoveConnectionCommand): Promise<void> {
    const connection = await this.connectionRepo.findOneOrFail({
      connectionId: command.connectionId,
      userId: command.userId,
      deletedAt: null,
    });

    await this.provider.adapters[connection.provider].disconnect(connection);

    const { emailAddress } = connection;

    const now = new Date();
    connection.isDisabled = true;
    connection.deletedAt = now;
    connection.updatedAt = now;
    connection.providerToken = '';
    connection.externalAccessToken = '';
    connection.emailAddress = this.utils.createHash(
      connection.emailAddress.toLowerCase(),
    );

    await this.connectionRepo.persistAndFlush(connection);
    await this.eventBus.publish(
      new ConnectionRemovedEvent({
        ...connection,
        emailAddress,
        trigger: command.trigger,
        reasonText: command.reasonText ?? '',
        experienceText: command.experienceText ?? '',
      }),
    );
  }
}
