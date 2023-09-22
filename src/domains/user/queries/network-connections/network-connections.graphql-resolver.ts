import { Args, Query, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';
import { graphqlUtils, PageInfo } from '@app/modules/graphql';

import { NetworkConnectionsQuery } from './network-connections.query';
import {
  NetworkConnectionEdge,
  NetworkConnectionsResponseDto,
} from './network-connections.response.dto';
import { NetworkConnectionsRequestDto } from './network-connections.request.dto';
import { NetworkConnectionsQueryResponse } from './network-connections.query-handler';

@Resolver()
export class NetworkConnectionsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => NetworkConnectionsResponseDto)
  @Allow(Role.User)
  async networkConnections(
    @Args('input') input: NetworkConnectionsRequestDto,
    @User() { userId }: AuthedUser,
  ): Promise<NetworkConnectionsResponseDto> {
    const { pagination, filter } = input;
    const { cursorValue, limit = 50 } = graphqlUtils.paginationToPg(pagination);

    let offset = cursorValue ? Number(cursorValue) : 0;

    if (pagination?.before) {
      offset -= limit;
      if (offset < 0) offset = 0;
    } else if (pagination?.after) {
      offset++;
    }

    const { networkConnections, hasNextPage, hasPreviousPage, total } =
      (await this.queryBus.execute(
        new NetworkConnectionsQuery(userId, limit, offset, filter),
      )) as NetworkConnectionsQueryResponse;

    const edges = networkConnections.map((message, index) => {
      const cursor = graphqlUtils.encodeCursor(String(offset + index));
      return new NetworkConnectionEdge({ cursor, node: message });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new NetworkConnectionsResponseDto({ edges, pageInfo });
  }
}
