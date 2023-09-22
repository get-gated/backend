import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import DonationRequestEntity from '../../entities/donation-request.entity';

import { DonationRequestQuery } from './donation-request.query';
import { DonationRequestQueryHandlerResponse } from './donation-request.query-handler';

@Resolver()
export class DonationRequestGraphqlResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Allow(Role.User)
  @Query(() => DonationRequestEntity)
  async donationRequest(
    @Args('id', { type: () => ID }) id: string,
    @User() { userId }: AuthedUser,
  ): Promise<DonationRequestEntity> {
    const { request }: DonationRequestQueryHandlerResponse =
      await this.queryBus.execute(new DonationRequestQuery(id));
    if (userId !== request.userId) {
      throw new NotFoundException();
    }

    return request;
  }
}
