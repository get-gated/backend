import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import StripeLib from 'stripe';
import PaymentProcessorAdapterInterface, {
  Charge,
} from '@app/interfaces/payment/payment-processor-adapter.interface';

import PaymentConfig from '../../../payment.config';
import CardDeclinedError from '../../../errors/card-declined.error';

@Injectable()
export default class StripeAdapter implements PaymentProcessorAdapterInterface {
  private stripe: StripeLib;

  constructor(
    @Inject(PaymentConfig.KEY)
    config: ConfigType<typeof PaymentConfig>,
    @Inject('STRIPE') Stripe: typeof StripeLib,
  ) {
    // the type definition for this version of stripe is incorrect
    this.stripe = new Stripe(
      config.stripe.apiKey,
      {} as StripeLib.StripeConfig,
    );
  }

  public async charge(
    amount: number,
    token: string,
    metadata?: never,
  ): Promise<Charge> {
    return this.stripe.charges
      .create({
        amount,
        currency: 'usd',
        source: token,
        metadata,
      })
      .then((charge) => ({
        id: charge.id,
      }))
      .catch((e) => {
        if (e.statusCode >= 400 && e.statusCode < 500 && 'decline_code' in e) {
          throw new CardDeclinedError();
        } else {
          throw e;
        }
      });
  }
}
