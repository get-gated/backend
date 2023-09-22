import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Maybe } from '@app/modules/utils';

import DonationRequestEntity from '../../entities/donation-request.entity';

import { RequestDonationCommand } from './request-donation.command';
import { RequestDonationRequestDto } from './request-donation.request.dto';

@Resolver()
export class RequestDonationGraphqlResolver {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectRepository(DonationRequestEntity)
    private donationReqRepo: EntityRepository<DonationRequestEntity>,
  ) {}

  @Mutation(() => DonationRequestEntity)
  @Allow(Role.User)
  async donationRequest(
    @Args('input')
    {
      amountInCents,
      type,
      memo,
      allowExemptionRequest,
      thankYouMessage,
      isFeatured,
      cta,
      name,
      id,
    }: RequestDonationRequestDto,
    @User() { userId }: AuthedUser,
  ): Promise<Maybe<DonationRequestEntity>> {
    const savedId = await this.commandBus.execute(
      new RequestDonationCommand(
        userId,
        type,
        amountInCents,
        memo,
        allowExemptionRequest,
        isFeatured,
        cta,
        thankYouMessage,
        undefined,
        name,
        id,
      ),
    );
    return this.donationReqRepo.findOne(savedId);
  }
}
