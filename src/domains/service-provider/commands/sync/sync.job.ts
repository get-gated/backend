import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IJob, Job } from '@app/modules/job';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { LoggerService } from '@app/modules/logger';
import { AsyncContextService } from '@app/modules/async-context';

import SyncEntity from '../../entities/sync.entity';

import { SyncCommand } from './sync.command';

@Injectable()
@Job('ConnectionSync')
export class SyncJob implements IJob {
  constructor(
    private commandBus: CommandBus,
    private log: LoggerService,
    @InjectRepository(SyncEntity)
    private syncRepo: EntityRepository<SyncEntity>,
    private ac: AsyncContextService,
  ) {}

  async run(): Promise<void> {
    // get the pending scheduled syncs
    const pendingSyncs = await this.syncRepo.find(
      {
        isSyncing: false,
        finishedAt: null,
        connection: {
          status: { $ne: Status.Invalid },
          deletedAt: null,
        },
      },
      { fields: ['connectionSyncId'] },
    );

    this.log.info({ pendingSyncs }, 'running sync job');

    await Promise.all(
      pendingSyncs.map((job) => {
        this.ac.register(); // todo figure out a way to get the userId and connectionId in here. Currently query builder is being diffuclt
        return this.commandBus.execute(new SyncCommand(job.connectionSyncId));
      }),
    );
  }
}
