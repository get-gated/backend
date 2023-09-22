import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { graphqlUtils, PageInfo, Pagination } from '@app/modules/graphql';
import { QueryOrder } from '@mikro-orm/core';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import {
  ChallengesRequest,
  ChallengesRequestFilter,
} from './challenges.request.dto';
import { ChallengesQuery } from './challenges.query';
import { ChallengeEdge, ChallengesResponse } from './challenges.response.dto';
import { TChallengesForUserHandlerReturn } from './challenges.handler';

@Resolver()
export class ChallengesGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  private async getChallenges(
    userId: string,
    pagination: Pagination = {},
    filter: ChallengesRequestFilter = {},
  ): Promise<ChallengesResponse> {
    const {
      cursorValue,
      order = pagination.last ? QueryOrder.DESC : QueryOrder.ASC,
      limit = 50,
    } = graphqlUtils.paginationToPg(pagination);

    const { recipient } = filter;

    const {
      challenges,
      hasNextPage,
      hasPreviousPage,
      total,
    }: TChallengesForUserHandlerReturn = await this.queryBus.execute(
      new ChallengesQuery(
        userId,
        cursorValue ? new Date(cursorValue) : new Date(),
        order,
        limit,
        recipient,
      ),
    );

    const edges = challenges.map((challenge) => {
      const cursor = graphqlUtils.encodeCursor(challenge.createdAt.toString());
      return new ChallengeEdge({ cursor, node: challenge });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new ChallengesResponse({ edges, pageInfo });
  }

  @Query(() => ChallengesResponse)
  @Allow(Role.User)
  async challenges(
    @Args('input') input: ChallengesRequest,
    @User() user: AuthedUser,
  ): Promise<ChallengesResponse> {
    const { userId } = user;
    const { pagination, filter } = input;
    return this.getChallenges(userId, pagination, filter);
  }
}
