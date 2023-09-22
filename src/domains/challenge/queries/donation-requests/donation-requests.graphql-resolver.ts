import { Args, Query, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';
import { QueryOrder } from '@mikro-orm/core';
import { graphqlUtils, PageInfo } from '@app/modules/graphql';

import { DonationRequestsQuery } from './donation-requests.query';
import { DonationRequestsRequestDto } from './donation-requests.request.dto';
import {
  DonationRequestEdge,
  DonationRequestsResponseDto,
} from './donation-requests.response.dto';
import { DonationRequestsQueryHandlerResponse } from './donation-requests.query-handler';

@Resolver()
export class DonationRequestsGraphqlResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => DonationRequestsResponseDto)
  @Allow(Role.User)
  async donationRequests(
    @User() { userId }: AuthedUser,
    @Args('input') { pagination, type, isActive }: DonationRequestsRequestDto,
  ): Promise<DonationRequestsResponseDto> {
    const {
      cursorValue,
      order = QueryOrder.DESC,
      limit = 50,
    } = graphqlUtils.paginationToPg(pagination);

    const {
      requests,
      hasPreviousPage,
      hasNextPage,
      total,
    }: DonationRequestsQueryHandlerResponse = await this.queryBus.execute(
      new DonationRequestsQuery(
        userId,
        cursorValue ? new Date(cursorValue) : new Date(),
        order,
        limit,
        type,
        isActive,
      ),
    );

    const edges = requests.map((request) => {
      const cursor = graphqlUtils.encodeCursor(request.createdAt.toString());
      return new DonationRequestEdge({ cursor, node: request });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new DonationRequestsResponseDto({ edges, pageInfo });
  }
}
