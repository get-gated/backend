import { Allow, SpecialRole } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import DonationRequestInteractionEntity from '../../entities/donation-request-interaction.entity';
import DonationRequestEntity from '../../entities/donation-request.entity';

import { DonateCommand } from './donate.command';
import { DonateRequestDto } from './donate.request.dto';
import { DonateResponseDto } from './donate.response.dto';

@Resolver()
export class DonateGraphqlResolver {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectRepository(DonationRequestInteractionEntity)
    private reqInteractionRepo: EntityRepository<DonationRequestInteractionEntity>,
    @InjectRepository(DonationRequestEntity)
    private donationReqRepo: EntityRepository<DonationRequestEntity>,
  ) {}

  @Mutation(() => DonateResponseDto)
  @Allow(SpecialRole.Unauthenticated)
  async donate(
    @Args('input') data: DonateRequestDto,
  ): Promise<DonateResponseDto> {
    const id = await this.commandBus.execute(
      new DonateCommand(
        data.donationRequestId,
        data.amountInCents,
        data.chargeProvider,
        data.chargeToken,
        data.note,
      ),
    );

    const [donatedInteraction, request] = await Promise.all([
      this.reqInteractionRepo.findOneOrFail(id),
      this.donationReqRepo.findOneOrFail(data.donationRequestId),
    ]);

    return {
      donatedInteraction,
      thankYouMessage: request?.thankYouMessage,
    };
  }
}
