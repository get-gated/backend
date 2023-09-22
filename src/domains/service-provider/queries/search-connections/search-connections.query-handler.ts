import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import ConnectionRepository from '../../entities/repositories/connection.repository';
import ConnectionEntity from '../../entities/connection.entity';

import { SearchConnectionsQuery } from './search-connections.query';

@QueryHandler(SearchConnectionsQuery)
export class SearchConnectionsQueryHandler
  implements IQueryHandler<SearchConnectionsQuery>
{
  constructor(private connRepo: ConnectionRepository) {}

  async execute(query: SearchConnectionsQuery): Promise<ConnectionEntity[]> {
    const q = query.query;
    const ilikeQuery = { $ilike: `%${q}%` };
    const connections = await this.connRepo.find({
      emailAddress: ilikeQuery,
    });

    return connections;
  }
}
