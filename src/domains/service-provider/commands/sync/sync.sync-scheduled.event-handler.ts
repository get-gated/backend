import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cache } from 'cache-manager';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CacheLock } from '@app/modules/cache/cache-lock.service';
import { LoggerService } from '@app/modules/logger';

import SyncEntity from '../../entities/sync.entity';
import { SyncScheduledEvent } from '../../events/sync-scheduled.event';

import { SyncCommand } from './sync.command';

const maxMessages = parseInt(process.env.SYNC_MAX_MESSAGES ?? '20', 10);

@EventHandler(SyncScheduledEvent, 'service-provider-sync', {
  flowControl: {
    maxMessages,
    maxExtensionMinutes: 180, // ack deadline will be extended to this maximum
  },
})
export class SyncScheduledEventHandler
  implements IEventHandler<SyncScheduledEvent>
{
  constructor(
    private commandBus: CommandBus,
    @InjectRepository(SyncEntity)
    private syncRepo: EntityRepository<SyncEntity>,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private cacheLock: CacheLock,
    private log: LoggerService,
  ) {}

  async shouldRun({
    connectionId,
    connectionSyncId,
  }: SyncScheduledEvent): Promise<boolean> {
    const sync = await this.syncRepo.findOneOrFail(connectionSyncId, {
      populate: ['connection'],
    });

    const {
      isFinished,
      type,
      connection: { isDisabled },
    } = sync;

    if (isFinished) {
      this.log.warn(
        { connectionId, connectionSyncId, type },
        'Sync is marked as finished. Ignoring sync.',
      );
      return false;
    }
    if (isDisabled) {
      this.log.warn(
        { connectionId, connectionSyncId, type },
        'Connection is not active. Ignoring sync.',
      );
      return false;
    }
    return true;
  }

  async handler(event: SyncScheduledEvent): Promise<any> {
    if (!(await this.shouldRun(event))) {
      return;
    }
    const { connectionId, connectionSyncId, type } = event;

    const cacheKey = `connection-sync-${connectionId}-${type}`;

    return this.cacheLock.withLock(
      {
        cache: this.cache,
        cacheKey,
        extTtl: 10,
      },
      async () => {
        await this.commandBus.execute(new SyncCommand(connectionSyncId));
      },
    );
  }
}
