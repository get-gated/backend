import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IJob, Job } from '@app/modules/job';
import { LoggerService } from '@app/modules/logger';
import { AsyncContextService } from '@app/modules/async-context';
import { ConfigType } from '@nestjs/config';
import { SyncType } from '@app/interfaces/service-provider/service-provider.enums';

import serviceProviderConfig from '../../service-provider.config';

import { ScheduleSyncCommand } from './schedule-sync.command';

/**
 * This job is primarily for testing sync processing.
 */
@Injectable()
@Job('ScheduleSync')
export class ScheduleSyncJob implements IJob {
  constructor(
    private commandBus: CommandBus,
    private log: LoggerService,
    private ac: AsyncContextService,
    @Inject(serviceProviderConfig.KEY)
    private config: ConfigType<typeof serviceProviderConfig>,
  ) {}

  async run(): Promise<void> {
    const { CONNECTION_IDS: connectionIds, MONTHS: months } = process.env;
    if (!connectionIds) {
      throw new Error('CONNECTION_IDS env variable is not defined');
    }

    this.ac.register();

    const now = new Date();
    const targetMonths = months
      ? parseInt(months, 10)
      : this.config.initialSyncDepthInMonths;
    const targetDepth = new Date(now.setMonth(now.getMonth() - targetMonths));

    const commands = connectionIds.split(',').flatMap((connectionId) => [
      (() => {
        this.log.info({ connectionId }, 'Scheduling Sent sync');
        return this.commandBus.execute(
          new ScheduleSyncCommand(connectionId, SyncType.Sent, targetDepth),
        );
      })(),
      (() => {
        this.log.info({ connectionId }, 'Scheduling Received sync');
        return this.commandBus.execute(
          new ScheduleSyncCommand(connectionId, SyncType.Received, targetDepth),
        );
      })(),
    ]);

    await Promise.all(commands);
  }
}
