import { Args, Query, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import { DonationTotalFromSenderResponseDto } from './donation-total-from-sender.response.dto';
import { DonationTotalFromSenderRequestDto } from './donation-total-from-sender.request.dto';
import { DonationTotalFromSenderQuery } from './donation-total-from-sender.query';

@Resolver()
export class DonationTotalFromSenderGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => DonationTotalFromSenderResponseDto)
  @Allow(Role.User)
  async donationTotalFromSender(
    @Args('input') { sender }: DonationTotalFromSenderRequestDto,
    @User() { userId }: AuthedUser,
  ): Promise<DonationTotalFromSenderResponseDto> {
    return this.queryBus.execute(
      new DonationTotalFromSenderQuery(userId, sender),
    );
  }
}
