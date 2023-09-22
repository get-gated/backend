import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';

import { PaymentAppService } from '../../../payment/payment.app-service';

import { MarkExpectedCommand } from './mark-expected.command';
import { MarkExpectedRequest } from './mark-expected.request.dto';

@Resolver()
export class MarkExpectedGraphqlResolver {
  constructor(
    private commandBus: CommandBus,
    private paymentService: PaymentAppService,
  ) {}

  @Mutation(() => Boolean)
  @Allow(SpecialRole.Unauthenticated)
  async challengeMarkExpected(
    @Args('input')
    {
      token,
      personalizedNote,
      expectedReason,
      expectedReasonDescription,
    }: MarkExpectedRequest,
  ): Promise<boolean> {
    const challengeId = this.paymentService.fromPaymentToken(
      Buffer.from(token, 'base64').toString(),
    ).initiatorId;
    await this.commandBus.execute(
      new MarkExpectedCommand(
        challengeId,
        expectedReason,
        expectedReasonDescription,
        personalizedNote,
      ),
    );
    return true;
  }
}
