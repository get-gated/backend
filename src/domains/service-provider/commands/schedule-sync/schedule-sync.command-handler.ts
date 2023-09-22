import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { EventBusService } from '@app/modules/event-bus';
import { LoggerService } from '@app/modules/logger';

import SyncEntity from '../../entities/sync.entity';
import ConnectionRepository from '../../entities/repositories/connection.repository';
import { SyncScheduledEvent } from '../../events/sync-scheduled.event';

import { ScheduleSyncCommand } from './schedule-sync.command';

@CommandHandler(ScheduleSyncCommand)
export class ScheduleSyncCommandHandler
  implements ICommandHandler<ScheduleSyncCommand>
{
  constructor(
    @InjectRepository(SyncEntity)
    private syncRepo: EntityRepository<SyncEntity>,
    private connectionRepo: ConnectionRepository,
    private eventBus: EventBusService,
    private em: EntityManager,
    private log: LoggerService,
  ) {}

  async execute(command: ScheduleSyncCommand): Promise<void> {
    const { type, targetDepth, connectionId } = command;

    const connection = await this.connectionRepo.findOneOrFail(connectionId);

    if (connection.isDisabled || connection.status === 'INVALID') {
      this.log.info(
        { connectionId, type },
        'Connection is disabled or invalid. Ignoring schedule request.',
      );
      return;
    }

    const existing = await this.syncRepo.findOne({
      connection: this.connectionRepo.getReference(connectionId),
      type,
      finishedAt: null,
    });

    if (existing) {
      this.log.info(
        { connectionId, type, connectionSyncId: existing.connectionSyncId },
        'Existing sync already scheduled. Ignoring schedule request.',
      );
      return;
    }

    const sync = new SyncEntity({
      connection,
      targetDepth,
      type,
    });

    await this.em.transactional(async (em) => {
      await em.persistAndFlush(sync);
      await this.eventBus.publish(
        new SyncScheduledEvent({
          connectionId,
          connectionSyncId: sync.connectionSyncId,
          type,
        }),
      );
    });
  }
}
