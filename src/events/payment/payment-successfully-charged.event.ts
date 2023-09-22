import { Event } from '@app/modules/event-bus';
import { PaymentInterface } from '@app/interfaces/payment/payment.interface';

@Event('PaymentSuccessfullyCharged')
export class PaymentSuccessfullyChargedEvent extends PaymentInterface {
  constructor(message: PaymentInterface) {
    super(message);
  }
}
