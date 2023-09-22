import { Body, Controller, Post } from '@nestjs/common';
import { Allow, Role } from '@app/modules/auth';
import {
  Status,
  SyncType,
} from '@app/interfaces/service-provider/service-provider.enums';
import { ConnectionChangedEvent } from '@app/events/service-provider/connection-changed.event';
import { CommandBus } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { LoggerService } from '@app/modules/logger';

import ConnectionRepository from '../../entities/repositories/connection.repository';
import SyncEntity from '../../entities/sync.entity';
import { ManagedBy } from '../../service-provider.enums';
import ConnectionEntity from '../../entities/connection.entity';

import { ChangeManagedByCommand } from './change-managed-by.command';

@Controller()
export class ChangeManagedByHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly connRepo: ConnectionRepository,
    private readonly eventBus: EventBusService,
    @InjectRepository(SyncEntity)
    private syncRepo: EntityRepository<SyncEntity>,
    private log: LoggerService,
  ) {}

  @Post('connection/migrate-internal')
  @Allow(Role.Admin)
  public async connectionMigrateToInternal(
    @Body() { connectionId }: Pick<ConnectionEntity, 'connectionId'>,
  ): Promise<void> {
    try {
      const connection = await this.connRepo.findOneOrFail(connectionId);

      if (connection.managedBy === ManagedBy.Internal) return;

      const previousStatus = connection.status;
      connection.status = Status.Initializing;
      await this.connRepo.persistAndFlush(connection);

      await this.commandBus.execute(
        new ChangeManagedByCommand(connectionId, ManagedBy.Internal, true),
      );

      const targetDepth = new Date();
      targetDepth.setMonth(targetDepth.getMonth() - 1);
      this.syncRepo.persist(
        new SyncEntity({
          connection,
          targetDepth,
          type: SyncType.Sent,
        }),
      );
      this.syncRepo.persist(
        new SyncEntity({
          connection,
          targetDepth,
          type: SyncType.Received,
        }),
      );
      await this.syncRepo.flush();
      await this.eventBus.publish(
        new ConnectionChangedEvent({ ...connection, previousStatus }),
      );
      return;
    } catch (error) {
      this.log.error({ error }, 'Error migrating user');
      throw error;
    }
  }
}
