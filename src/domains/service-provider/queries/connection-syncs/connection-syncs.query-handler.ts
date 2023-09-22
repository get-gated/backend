import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import SyncEntity from '../../entities/sync.entity';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { ConnectionSyncsQuery } from './connection-syncs.query';

@QueryHandler(ConnectionSyncsQuery)
export class ConnectionSyncsQueryHandler
  implements IQueryHandler<ConnectionSyncsQuery>
{
  constructor(
    @InjectRepository(SyncEntity)
    private syncRepo: EntityRepository<SyncEntity>,
    private connectionRepo: ConnectionRepository,
  ) {}

  async execute(query: ConnectionSyncsQuery): Promise<SyncEntity[]> {
    const results = await this.syncRepo.find({
      connection: this.connectionRepo.getReference(query.connectionId),
    });

    return results || [];
  }
}
