/* eslint-disable no-await-in-loop */
import { IJob, Job } from '@app/modules/job';
import { CommandBus } from '@nestjs/cqrs';
import { LoggerService } from '@app/modules/logger';
import { AsyncContextService } from '@app/modules/async-context';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { ConcurrentProcessingError } from '@app/modules/cache/cache-lock.service';

import { ManagedBy } from '../../service-provider.enums';
import { GoogleService } from '../../services/provider/adapters/google/google.service';
import { InvalidTokenError } from '../../errors/invalid-token.error';
import ServiceProviderConfig from '../../service-provider.config';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { ProcessGmailHistoryCommand } from './process-gmail-history.command';

@Job('ProcessGmailHistoryCatchUp')
export class ProcessGmailHistoryCatchUpJob implements IJob {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly connRepo: ConnectionRepository,
    private readonly log: LoggerService,
    private readonly ac: AsyncContextService,
    @Inject(ServiceProviderConfig.KEY)
    private config: ConfigType<typeof ServiceProviderConfig>,
    private readonly google: GoogleService,
  ) {}

  async run(): Promise<void> {
    if (!this.config.historyCatchUpLatencyUpInMin) {
      return this.log.error(
        'Cannot run ProcessGmailHistoryCatchUp job due to lack of configuration of historyCatchUpLatencyUpInMin',
      );
    }
    const since = new Date();
    since.setMinutes(
      since.getMinutes() - this.config.historyCatchUpLatencyUpInMin,
    );

    const connections = await this.connRepo.find({
      $or: [
        {
          lastHistoryProcessedAt: {
            $lt: since,
          },
        },
        { lastHistoryProcessedAt: null },
      ],
      deletedAt: null,
      managedBy: ManagedBy.Internal,
      status: Status.Running,
    });

    for (let i = 0; i < connections.length; i++) {
      const connection = connections[i];

      this.ac.register({
        userId: connection.userId,
        connectionId: connection.connectionId,
      });

      this.log.info(
        'Catching up history for user via ProcessGmailHistoryCatchUp',
      );
      try {
        await this.commandBus.execute(
          new ProcessGmailHistoryCommand(connection.connectionId),
        );
        // make sure the email address on file
        const prevEmail = connection.emailAddress;
        await this.google.updateEmailAddress(connection);

        if (connection.emailAddress !== prevEmail) {
          await this.connRepo.persistAndFlush(connection);
        }
      } catch (error) {
        if (error instanceof ConcurrentProcessingError) return;
        if (error instanceof InvalidTokenError) return; // handled in the command handler
        this.log.error({ error }, 'Error catching up. Skipping');
      }
    }
  }
}
