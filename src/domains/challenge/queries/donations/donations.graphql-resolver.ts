import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';
import { QueryOrder } from '@mikro-orm/core';
import { graphqlUtils, PageInfo, Pagination } from '@app/modules/graphql';

import DonationRequestEntity from '../../entities/donation-request.entity';

import { DonationsQuery } from './donations.query';
import {
  DonationsRequestDto,
  DonationsWithoutRequestIdDto,
} from './donations.request.dto';
import {
  DonationRequestEdge,
  DonationsResponseDto,
} from './donations.response.dto';
import { DonationsQueryHandlerResponse } from './donations.query-handler';

@Resolver(() => DonationRequestEntity)
export class DonationsGraphqlResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => DonationsResponseDto)
  @Allow(Role.User)
  async donations(
    @User() { userId }: AuthedUser,
    @Args('input') { pagination, donationRequestId }: DonationsRequestDto,
  ): Promise<DonationsResponseDto> {
    return this.getDonations(userId, donationRequestId ?? '', pagination);
  }

  @ResolveField(() => Date)
  async lastDonatedAt(
    @Parent() { donationRequestId, userId }: DonationRequestEntity,
  ): Promise<Date | void> {
    const donations = await this.getDonations(userId, donationRequestId, {
      last: 1,
    });

    if (donations.edges.length > 0) {
      return donations.edges[0].node.performedAt;
    }
  }

  @ResolveField(() => DonationsResponseDto, { name: 'donations' })
  async donationsField(
    @Parent() { donationRequestId, userId }: DonationRequestEntity,
    @Args('input')
    { pagination }: DonationsWithoutRequestIdDto,
  ): Promise<DonationsResponseDto> {
    return this.getDonations(userId, donationRequestId, pagination);
  }

  private async getDonations(
    userId: string,
    donationRequestId: string,
    pagination?: Pagination,
  ): Promise<DonationsResponseDto> {
    const {
      cursorValue,
      order = QueryOrder.DESC,
      limit = 50,
    } = graphqlUtils.paginationToPg(pagination);

    const {
      donations,
      hasPreviousPage,
      hasNextPage,
      total,
    }: DonationsQueryHandlerResponse = await this.queryBus.execute(
      new DonationsQuery(
        userId,
        cursorValue ? new Date(cursorValue) : new Date(),
        order,
        limit,
        donationRequestId,
      ),
    );

    const edges = donations.map((donation) => {
      const cursor = graphqlUtils.encodeCursor(donation.performedAt.toString());
      return new DonationRequestEdge({ cursor, node: donation });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new DonationsResponseDto({ edges, pageInfo });
  }
}
