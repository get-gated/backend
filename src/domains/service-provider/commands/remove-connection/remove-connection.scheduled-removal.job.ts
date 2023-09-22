/* eslint-disable no-await-in-loop */
import { IJob, Job } from '@app/modules/job';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { LoggerService } from '@app/modules/logger';
import { AsyncContextService } from '@app/modules/async-context';
import { ConnectionRemovedTrigger } from '@app/interfaces/service-provider/service-provider.enums';

import ConnectionRepository from '../../entities/repositories/connection.repository';
import ServiceProviderConfig from '../../service-provider.config';
import ScheduledConnectionRemovalEntity from '../../entities/scheduled-connection-removal.entity';

import { RemoveConnectionCommand } from './remove-connection.command';

@Job('ScheduledConnectionRemoval')
export class RemoveConnectionScheduledRemovalJob implements IJob {
  constructor(
    @InjectRepository(ScheduledConnectionRemovalEntity)
    private scheduleRepo: EntityRepository<ScheduledConnectionRemovalEntity>,
    @Inject(ServiceProviderConfig.KEY)
    private config: ConfigType<typeof ServiceProviderConfig>,
    private commandBus: CommandBus,
    private connRepo: ConnectionRepository,
    private log: LoggerService,
    private ac: AsyncContextService,
  ) {}

  async run(): Promise<void> {
    const since = new Date();
    since.setDate(this.config.removeConnectionsInvalidForDays * -1);
    const scheduled = await this.scheduleRepo.find({
      createdAt: { $lt: since },
      completedAt: null,
    });

    for (let i = 0; i < scheduled.length; i++) {
      const connection = await this.connRepo.findOne(scheduled[i].connectionId);
      if (connection) {
        this.ac.register({
          connectionId: connection.connectionId,
          userId: connection.userId,
        });
        await this.commandBus.execute(
          new RemoveConnectionCommand(
            connection.userId,
            scheduled[i].connectionId,
            ConnectionRemovedTrigger.User,
          ),
        );
        scheduled[i].completedAt = new Date();
        await this.scheduleRepo.persistAndFlush(scheduled[i]);
      } else {
        this.log.warn(
          { scheduledRemove: scheduled[i] },
          'Skipping connection removal as connection was not found for given id',
        );
      }
    }
  }
}
