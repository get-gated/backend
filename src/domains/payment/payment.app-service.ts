import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PaymentInterface } from '@app/interfaces/payment/payment.interface';
import { PaymentInitiator } from '@app/interfaces/payment/payment.enums';

import {
  IPaymentTokenPayload,
  PaymentService,
} from './services/payment.service';
import { PaymentQuery } from './queries/payment/payment.query';
import PaymentEntity from './entities/payment.entity';
import { ChargeCommand } from './commands/charge/charge.command';

@Injectable()
export class PaymentAppService {
  constructor(
    private queryBus: QueryBus,
    private paymentService: PaymentService,
    private commandBus: CommandBus,
  ) {}

  public fromPaymentToken(token: string): IPaymentTokenPayload {
    return this.paymentService.fromPaymentToken(token);
  }

  public toPaymentToken(
    initiator: PaymentInitiator,
    initiatorId: string,
  ): string {
    return this.paymentService.toPaymentToken(initiator, initiatorId);
  }

  public async queryPayment(paymentId: string): Promise<PaymentInterface> {
    const results: PaymentEntity[] = await this.queryBus.execute(
      new PaymentQuery([paymentId]),
    );
    if (results.length === 0) {
      throw new NotFoundException('Payment not found');
    }

    return results[0];
  }

  public async charge(input: ChargeCommand): Promise<any> {
    return this.commandBus.execute(
      new ChargeCommand(
        input.provider,
        input.chargeToken,
        input.amountCents,
        input.initiator,
        input.initiatorId,
      ),
    );
  }
}
