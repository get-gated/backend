import { Injectable } from '@nestjs/common';
import PaymentProcessorAdapterInterface from '@app/interfaces/payment/payment-processor-adapter.interface';
import { Provider } from '@app/interfaces/payment/payment.enums';

import StripeAdapter from './adapters/stripe.adapter';

type Adapters = {
  [key in Provider]: PaymentProcessorAdapterInterface;
};

@Injectable()
export class PaymentProcessorService {
  private ADAPTERS: Adapters;

  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private stripeAdapter: StripeAdapter,
  ) {
    this.ADAPTERS = {
      Stripe: stripeAdapter,
    };
  }

  public adapt(): Adapters {
    return this.ADAPTERS;
  }
}
