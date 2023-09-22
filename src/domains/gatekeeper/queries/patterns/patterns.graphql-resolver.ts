import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, Role } from '@app/modules/auth';
import { graphqlUtils, PageInfo } from '@app/modules/graphql';

import { PatternsQuery } from './patterns.query';
import { PatternsRequest } from './patterns.request.dto';
import { TPatternsQueryResponse } from './patterns.query-handler';
import { PatternsEdge, PatternsResponse } from './patterns.response.dto';

@Resolver()
export class PatternsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => PatternsResponse)
  @Allow(Role.Admin)
  public async patterns(
    @Args('input') input: PatternsRequest,
  ): Promise<PatternsResponse> {
    const { cursorValue, limit = 50 } = graphqlUtils.paginationToPg(
      input.pagination,
    );

    const {
      patterns,
      hasPreviousPage,
      hasNextPage,
      total,
    }: TPatternsQueryResponse = await this.queryBus.execute(
      new PatternsQuery(
        limit,
        cursorValue ? new Date(cursorValue) : undefined,
        input.filter,
      ),
    );

    const edges = patterns.map((pattern) => {
      const cursor = graphqlUtils.encodeCursor(pattern.createdAt.toString());
      return new PatternsEdge({ cursor, node: pattern });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new PatternsResponse({ edges, pageInfo });
  }
}
