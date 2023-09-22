import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { graphqlUtils, PageInfo, Pagination } from '@app/modules/graphql';
import { QueryOrder } from '@mikro-orm/core';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import ChallengeEntity from '../../entities/challenge.entity';

import { ChallengeInteractionsRequest } from './challenge-interactions.request.dto';
import { ChallengeInteractionsQuery } from './challenge-interactions.query';
import { TChallangeInteractionHandlerResponse } from './challenge-interactions.handler';
import {
  ChallengeInteractionEdge,
  ChallengeInteractionsResponse,
} from './challenge-interactions.response.dto';

@Resolver(() => ChallengeEntity)
export class ChallengeInteractionsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => ChallengeInteractionsResponse, { name: 'challengeInteractions' })
  @Allow(Role.User)
  async queryInteractions(
    @Args('input') { pagination, interaction }: ChallengeInteractionsRequest,
    @User() { userId }: AuthedUser,
  ): Promise<ChallengeInteractionsResponse> {
    return this.getInteractions(userId, pagination, interaction);
  }

  @ResolveField()
  async interactions(
    @Args('input') { pagination, interaction }: ChallengeInteractionsRequest,
    @Parent() parent: ChallengeEntity,
  ): Promise<ChallengeInteractionsResponse> {
    return this.getInteractions(
      parent.userId,
      pagination,
      interaction,
      parent.challengeId,
    );
  }

  @ResolveField(() => Boolean)
  async hasDonation(
    @Parent() { challengeId, userId }: ChallengeEntity,
  ): Promise<boolean> {
    const interactions = await this.getInteractions(
      userId,
      { last: 1 },
      ChallengeInteraction.Donated,
      challengeId,
    );
    return interactions.edges.length > 0;
  }

  @ResolveField(() => Boolean)
  async hasExpected(
    @Parent() { challengeId, userId }: ChallengeEntity,
  ): Promise<boolean> {
    const interactions = await this.getInteractions(
      userId,
      { last: 1 },
      ChallengeInteraction.Expected,
      challengeId,
    );
    return interactions.edges.length > 0;
  }

  private async getInteractions(
    userId: string,
    pagination: Pagination | undefined,
    interaction: ChallengeInteraction,
    challengeId?: string,
  ): Promise<ChallengeInteractionsResponse> {
    const {
      cursorValue,
      order = QueryOrder.DESC,
      limit = 50,
    } = graphqlUtils.paginationToPg(pagination);

    const {
      challengeInteractions,
      hasPreviousPage,
      hasNextPage,
      total,
    }: TChallangeInteractionHandlerResponse = await this.queryBus.execute(
      new ChallengeInteractionsQuery(
        userId,
        cursorValue ? new Date(cursorValue) : new Date(),
        order,
        limit,
        interaction,
        challengeId,
      ),
    );

    const edges = challengeInteractions.map((challengeInteraction) => {
      const cursor = graphqlUtils.encodeCursor(
        challengeInteraction.performedAt.toString(),
      );
      return new ChallengeInteractionEdge({
        cursor,
        node: challengeInteraction,
      });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new ChallengeInteractionsResponse({ edges, pageInfo });
  }
}
