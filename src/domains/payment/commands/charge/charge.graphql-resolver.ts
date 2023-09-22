import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';
import { Inject } from '@nestjs/common';

import PaymentConfig from '../../payment.config';
import { PaymentService } from '../../services/payment.service';
import CardDeclinedError from '../../errors/card-declined.error';

import { ChargeDto } from './charge.dto';
import { ChargeCommand } from './charge.command';

@Resolver()
export class ChargeGraphqlResolver {
  constructor(
    @Inject(PaymentConfig.KEY)
    private commandBus: CommandBus,
    private paymentService: PaymentService,
  ) {}

  @Mutation(() => Boolean)
  @Allow(SpecialRole.Unauthenticated)
  async paymentCharge(@Args('input') input: ChargeDto): Promise<boolean> {
    const paymentData = this.paymentService.fromPaymentToken(
      Buffer.from(input.paymentToken, 'base64').toString(),
    );

    try {
      await this.commandBus.execute(
        new ChargeCommand(
          input.provider,
          input.chargeToken,
          input.amountCents,
          paymentData.initiator,
          paymentData.initiatorId,
          input.note,
        ),
      );
    } catch (e) {
      if (e instanceof CardDeclinedError) {
        return false;
      }
      throw e;
    }

    return true;
  }
}
