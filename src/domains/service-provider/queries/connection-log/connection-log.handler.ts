import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ConnectionLogEntity from '../../entities/connection-log.entity';

import { ConnectionLogQuery } from './connection-log.query';

@QueryHandler(ConnectionLogQuery)
export class ConnectionLogHandler implements IQueryHandler<ConnectionLogQuery> {
  constructor(
    @InjectRepository(ConnectionLogEntity)
    private connectionLogRepo: EntityRepository<ConnectionLogEntity>,
  ) {}

  async execute(query: ConnectionLogQuery): Promise<ConnectionLogEntity[]> {
    return this.connectionLogRepo.find({
      connectionLogId: { $in: query.connectionIds },
    });
  }
}
