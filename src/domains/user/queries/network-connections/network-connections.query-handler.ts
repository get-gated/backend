import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';

import UserNetworkConnectionEntity from '../../entities/network-connection.entity';

import { NetworkConnectionsQuery } from './network-connections.query';

export interface NetworkConnectionsQueryResponse {
  networkConnections: UserNetworkConnectionEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(NetworkConnectionsQuery)
export class NetworkConnectionsQueryHandler
  implements
    IQueryHandler<NetworkConnectionsQuery, NetworkConnectionsQueryResponse>
{
  constructor(
    @InjectRepository(UserNetworkConnectionEntity)
    private networkConnRepo: EntityRepository<UserNetworkConnectionEntity>,
  ) {}

  async execute(
    query: NetworkConnectionsQuery,
  ): Promise<NetworkConnectionsQueryResponse> {
    const { userId, limit, offset, filter } = query;

    const where: FilterQuery<UserNetworkConnectionEntity> = {
      userId,
    };

    if (filter?.isUsingGated) {
      where.gatedUser = { disabledAt: null, userId: { $ne: null } };
    }

    const networkConnections = await this.networkConnRepo.find(where, {
      orderBy: { gatedUser: { joinedAt: QueryOrder.DESC } },
      limit,
      offset,
      populate: ['gatedUser'],
    });

    let hasNextPage;

    if (networkConnections.length === limit + 1) {
      networkConnections.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const hasPreviousPage = Boolean(offset);

    const total = await this.networkConnRepo.count(where);

    return { networkConnections, hasPreviousPage, hasNextPage, total };
  }
}
