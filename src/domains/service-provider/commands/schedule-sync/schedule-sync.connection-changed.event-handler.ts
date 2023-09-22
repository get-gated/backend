import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { QueryOrder } from '@mikro-orm/core';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import {
  Status,
  SyncType,
} from '@app/interfaces/service-provider/service-provider.enums';
import { ConnectionChangedEvent } from '@app/events/service-provider/connection-changed.event';
import { LoggerService } from '@app/modules/logger';

import ConnectionRepository from '../../entities/repositories/connection.repository';
import ConnectionLogEntity from '../../entities/connection-log.entity';

import { ScheduleSyncCommand } from './schedule-sync.command';

@EventHandler(ConnectionChangedEvent, 'service-provider-schedule-sync')
export class ScheduleSyncConnectionChangedEventHandler
  implements IEventHandler<ConnectionChangedEvent>
{
  constructor(
    private commandBus: CommandBus,
    private connectionRepo: ConnectionRepository,
    @InjectRepository(ConnectionLogEntity)
    private connectionLogRepo: EntityRepository<ConnectionLogEntity>,
    private log: LoggerService,
  ) {}

  private async getTargetDepth(connectionId: string): Promise<Date> {
    const invalidLog = await this.connectionLogRepo.findOne(
      {
        connection: this.connectionRepo.getReference(connectionId),
        status: Status.Invalid,
      },
      { orderBy: { createdAt: QueryOrder.DESC } },
    );
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const targetDepth = invalidLog ? invalidLog.createdAt : oneMonthAgo;
    return targetDepth;
  }

  async handler(event: ConnectionChangedEvent): Promise<void> {
    // only if we transition from invalid to running
    if (
      !(
        event.previousStatus === Status.Invalid &&
        event.status === Status.Running
      )
    ) {
      return;
    }

    const { connectionId } = event;

    const targetDepth = await this.getTargetDepth(connectionId);

    this.log.info(
      { connectionId, targetDepth },
      'Scheduling syncs for revalidated connection.',
    );

    await this.commandBus.execute(
      new ScheduleSyncCommand(connectionId, SyncType.Sent, targetDepth),
    );

    await this.commandBus.execute(
      new ScheduleSyncCommand(connectionId, SyncType.Received, targetDepth),
    );
  }
}
