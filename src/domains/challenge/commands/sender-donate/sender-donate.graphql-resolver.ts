import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';

import { SenderDonateCommand } from './sender-donate.command';
import { SenderDonateRequestDto } from './sender-donate.request.dto';

@Resolver()
export class SenderDonateGraphqlResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => Boolean)
  @Allow(SpecialRole.Unauthenticated)
  async challengeSenderDonate(
    @Args('input') data: SenderDonateRequestDto,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new SenderDonateCommand(
        Buffer.from(data.paymentToken, 'base64').toString(),
        data.chargeProvider,
        data.chargeToken,
        data.amountInCents,
        data.personalizedNote,
      ),
    );

    return true;
  }
}
