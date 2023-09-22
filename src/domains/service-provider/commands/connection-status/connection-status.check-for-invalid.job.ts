/* eslint-disable no-await-in-loop */
import { IJob, Job } from '@app/modules/job';
import { CommandBus } from '@nestjs/cqrs';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { AsyncContextService } from '@app/modules/async-context';

import ConnectionRepository from '../../entities/repositories/connection.repository';
import { ProviderService } from '../../services/provider/provider.service';

import { ConnectionStatusCommand } from './connection-status.command';

@Job('ConnectionStatusCheckForInvalid')
export class ConnectionStatusCheckForInvalidJob implements IJob {
  constructor(
    private commandBus: CommandBus,
    private connRepo: ConnectionRepository,
    private serviceProvider: ProviderService,
    private ac: AsyncContextService,
  ) {}

  public async run(): Promise<void> {
    const limit = 100;

    const getPage = async (offset: number): Promise<void> => {
      const connections = await this.connRepo.find(
        { status: Status.Running, deletedAt: null },
        { limit, offset },
      );

      if (connections.length === 0) return;

      for (let i = 0; i < connections.length; i++) {
        const connection = connections[i];

        try {
          this.ac.register({
            userId: connection.userId,
            connectionId: connection.connectionId,
          });
          const isTokenValid = await this.serviceProvider.adapters[
            connection.provider
          ].isProviderTokenValid(connection);

          if (!isTokenValid) {
            await this.commandBus.execute(
              new ConnectionStatusCommand(
                connection.connectionId,
                Status.Invalid,
              ),
            );
          }
        } catch (error) {
          return;
        }
      }

      return getPage(offset + limit);
    };

    await getPage(0);
  }
}
