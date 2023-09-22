import { Event } from '@app/modules/event-bus';
import { PaymentInterface } from '@app/interfaces/payment/payment.interface';

@Event('PaymentFailedCharged')
export class PaymentFailedChargedEvent extends PaymentInterface {
  constructor(message: PaymentInterface) {
    super(message);
  }
}
