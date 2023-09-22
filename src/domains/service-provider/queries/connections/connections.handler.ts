import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryOrder } from '@mikro-orm/core';

import ConnectionRepository from '../../entities/repositories/connection.repository';
import ConnectionEntity from '../../entities/connection.entity';

import { ConnectionsQuery } from './connections.query';

@QueryHandler(ConnectionsQuery)
export class ConnectionsHandler implements IQueryHandler<ConnectionsQuery> {
  constructor(private connectionRepo: ConnectionRepository) {}

  async execute(query: ConnectionsQuery): Promise<ConnectionEntity[]> {
    return this.connectionRepo.find(
      {
        $and: [
          { userId: query.userId },
          { $or: [{ isDisabled: { $ne: true } }, { isDisabled: null }] },
        ],
      },
      { orderBy: { createdAt: QueryOrder.DESC } },
    );
  }
}
