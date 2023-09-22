import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import ConnectionRepository from '../../entities/repositories/connection.repository';

import { ConnectionByProviderUserIdQuery } from './connection-by-provider-user-id.query';

@QueryHandler(ConnectionByProviderUserIdQuery)
export class ConnectionByProviderIdQueryHandler
  implements IQueryHandler<ConnectionByProviderUserIdQuery>
{
  constructor(private readonly connRepo: ConnectionRepository) {}

  async execute(query: ConnectionByProviderUserIdQuery): Promise<any> {
    return this.connRepo.findOne({
      providerUserId: query.providerUserId,
      deletedAt: null,
    });
  }
}
