import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { graphqlUtils, PageInfo } from '@app/modules/graphql';
import { QueryOrder } from '@mikro-orm/core';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import {
  SentReceivedStatsEdge,
  SentReceivedStatsResponseDto,
} from './sent-received-stats.response.dto';
import { SentReceivedStatsRequestDto } from './sent-received-stats.request.dto';
import { TSentReceivedStatsQueryResponse } from './sent-received-stats.query-handler';
import { SentReceivedStatsQuery } from './sent-received-stats.query';

@Resolver()
export class SentReceivedStatsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => SentReceivedStatsResponseDto)
  @Allow(Role.User)
  async sentReceivedStats(
    @Args('input')
    { pagination, type, filter, sortBy }: SentReceivedStatsRequestDto,
    @User() { userId }: AuthedUser,
  ): Promise<SentReceivedStatsResponseDto> {
    const { cursorValue, limit = 50 } = graphqlUtils.paginationToPg(pagination);

    let offset = cursorValue ? Number(cursorValue) : 0;

    if (pagination?.after) {
      offset -= limit;
      if (offset < 0) offset = 0;
    } else if (pagination?.before) {
      offset++;
    }

    const {
      sentReceivedStats,
      hasPreviousPage,
      hasNextPage,
      total,
    }: TSentReceivedStatsQueryResponse = await this.queryBus.execute(
      new SentReceivedStatsQuery(
        userId,
        sortBy,
        QueryOrder.DESC,
        limit,
        offset,
        type,
        filter?.query,
        filter?.receivedCountGreaterThan,
        filter?.receivedCountLessThan,
        filter?.sentCountGreaterThan,
        filter?.sentCountLessThan,
        filter?.firstSeenAtSince,
        filter?.firstSeenAtBefore,
        filter?.lastSeenAtSince,
        filter?.lastSeenAtBefore,
        filter?.forDomain,
      ),
    );

    const edges = sentReceivedStats.map((node, index) => {
      const cursor = graphqlUtils.encodeCursor(String(offset + index));
      return new SentReceivedStatsEdge({ cursor, node });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new SentReceivedStatsResponseDto({ edges, pageInfo });
  }
}
