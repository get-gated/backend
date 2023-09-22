import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import DonationRequestEntity from '../../entities/donation-request.entity';

import { DonationRequestStatsResponseDto } from './donation-request-stats.response.dto';
import { DonationRequestStatsRequestDto } from './donation-request-stats.request.dto';
import { DonationRequestStatsQuery } from './donation-request-stats.query';

@Resolver(() => DonationRequestEntity)
export class DonationRequestStatsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => DonationRequestStatsResponseDto)
  @Allow(Role.User)
  async donationRequestStats(
    @User() { userId }: AuthedUser,
    @Args('input') { donationRequestId }: DonationRequestStatsRequestDto,
  ): Promise<any> {
    return this.queryBus.execute(
      new DonationRequestStatsQuery(userId, donationRequestId),
    );
  }

  @ResolveField(() => DonationRequestStatsRequestDto)
  async stats(
    @Parent() { donationRequestId, userId }: DonationRequestEntity,
  ): Promise<any> {
    return this.queryBus.execute(
      new DonationRequestStatsQuery(userId, donationRequestId),
    );
  }
}
