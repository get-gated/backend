import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoggerService } from '@app/modules/logger';

import ConnectionRepository from '../../entities/repositories/connection.repository';
import { ProviderService } from '../../services/provider/provider.service';

import { ChangeManagedByCommand } from './change-managed-by.command';

@CommandHandler(ChangeManagedByCommand)
export class ChangeManagedByCommandHandler
  implements ICommandHandler<ChangeManagedByCommand>
{
  constructor(
    private connRepo: ConnectionRepository,
    private provider: ProviderService,
    private log: LoggerService,
  ) {}

  async execute(command: ChangeManagedByCommand): Promise<any> {
    const connection = await this.connRepo.findOneOrFail(command.connectionId);

    try {
      await this.provider.adapters[connection.provider].disconnect(
        connection,
        false,
      );
    } catch (error) {
      this.log.warn(
        { error },
        'Error disconnecting old manage by integration. ignoring and proceeding',
      );
    }

    connection.managedBy = command.manageBy;
    connection.updatedAt = new Date();
    connection.expectedLabelId = '';
    connection.gatedLabelId = '';
    connection.donatedLabelId = '';
    connection.externalAccountId = '';
    connection.externalAccountId = '';

    const serviceProvider = this.provider.adapters[connection.provider];

    try {
      // make sure we clear out any existing watches on gmail that could prevent a new .connect call from succeeding
      await serviceProvider.disconnect(connection, false);
    } catch (error) {
      this.log.warn(
        { error },
        'Error disconnecting new managed by integration. ignoring and proceeding',
      );
    }

    await serviceProvider.checkGatedLabels(connection);

    if (command.insertLabelInstructions) {
      await serviceProvider.insertLabelInstructions(connection);
    }

    await serviceProvider.connect(connection);

    await this.connRepo.persistAndFlush(connection);
  }
}
