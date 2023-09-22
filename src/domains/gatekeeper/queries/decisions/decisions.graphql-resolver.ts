import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { graphqlUtils, PageInfo, Pagination } from '@app/modules/graphql';
import { QueryOrder } from '@mikro-orm/core';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import { TDecisionsHandlerResponse } from './decisions.handler';
import { DecisionsQuery } from './decisions.query';
import { DecisionEdge, DecisionsResponse } from './decisions.response.dto';
import {
  DecisionsRequest,
  DecisionsRequestFilter,
} from './decisions.request.dto';

@Resolver()
export class DecisionsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  private async getDecisions(
    userId: string,
    // eslint-disable-next-line default-param-last
    pagination: Pagination = {},
    filter?: DecisionsRequestFilter,
  ): Promise<DecisionsResponse> {
    const {
      cursorValue,
      order = QueryOrder.DESC,
      limit = 50,
    } = graphqlUtils.paginationToPg(pagination);

    const {
      decisions,
      hasNextPage,
      hasPreviousPage,
      total,
    }: TDecisionsHandlerResponse = await this.queryBus.execute(
      new DecisionsQuery(
        userId,
        cursorValue ? new Date(cursorValue) : new Date(),
        order,
        limit,
        filter,
      ),
    );

    const edges = decisions.map((decision) => {
      const cursor = graphqlUtils.encodeCursor(decision.decidedAt.toString());
      return new DecisionEdge({ cursor, node: decision });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new DecisionsResponse({ edges, pageInfo });
  }

  @Query(() => DecisionsResponse)
  @Allow([Role.User, Role.Admin])
  async decisions(
    @Args('input') input: DecisionsRequest,
    @User() user: AuthedUser,
  ): Promise<DecisionsResponse> {
    const { userId } = user;
    const { pagination, filter } = input;
    return this.getDecisions(userId, pagination, filter);
  }
}
