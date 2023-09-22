import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import DonationRequestEntity from '../../entities/donation-request.entity';
import DonationRequestInteractionEntity from '../../entities/donation-request-interaction.entity';

import { DonationQuery } from './donation.query';

@Resolver(() => DonationRequestEntity)
export class DonationGraphqlResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => DonationRequestInteractionEntity)
  @Allow(Role.User)
  async donation(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @User() { userId }: AuthedUser,
    @Args('id', { type: () => ID }) donationRequestInteractionId: string,
  ): Promise<DonationRequestInteractionEntity> {
    return this.queryBus.execute(
      new DonationQuery(donationRequestInteractionId),
    );
  }
}
