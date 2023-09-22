import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ConnectionEntity from '../../entities/connection.entity';

import { ConnectionQuery } from './connection.query';

@QueryHandler(ConnectionQuery)
export class ConnectionQueryHandler implements IQueryHandler<ConnectionQuery> {
  constructor(
    @InjectRepository(ConnectionEntity)
    private connectionRepo: EntityRepository<ConnectionEntity>,
  ) {}

  execute(query: ConnectionQuery): Promise<ConnectionEntity[]> {
    return this.connectionRepo.find({
      connectionId: { $in: query.connectionIds },
    });
  }
}
