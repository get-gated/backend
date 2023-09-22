import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { graphqlUtils, PageInfo } from '@app/modules/graphql';
import { QueryOrder } from '@mikro-orm/core';

import ConnectionEntity from '../../entities/connection.entity';
import ConnectionLogEntity from '../../entities/connection-log.entity';

import { ConnectionLogsRequest } from './connection-logs.request.dto';
import {
  ConnectionLogEdge,
  ConnectionLogsResponse,
} from './connection-logs.response.dto';
import { ConnectionLogsQuery } from './connection-logs.query';
import { TConnectionLogsQueryResponse } from './connection-logs.handler';

@Resolver(() => ConnectionEntity)
export class ConnectionLogsForConnectionGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @ResolveField(() => [ConnectionLogEntity])
  async logs(
    @Args() { pagination }: ConnectionLogsRequest,
    @Parent() parent: ConnectionEntity,
  ): Promise<ConnectionLogsResponse> {
    const {
      cursorValue,
      order = QueryOrder.DESC,
      limit = 50,
    } = graphqlUtils.paginationToPg(pagination);

    const {
      connectionLogs,
      hasPreviousPage,
      hasNextPage,
      total,
    }: TConnectionLogsQueryResponse = await this.queryBus.execute(
      new ConnectionLogsQuery(
        parent.connectionId,
        cursorValue ? new Date(cursorValue) : new Date(),
        order,
        limit,
      ),
    );

    const edges = connectionLogs.map((node) => {
      const cursor = graphqlUtils.encodeCursor(node.createdAt.toString());
      return new ConnectionLogEdge({ cursor, node });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new ConnectionLogsResponse({ edges, pageInfo });
  }
}
