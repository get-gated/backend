import { Provider } from '@app/interfaces/payment/payment.enums';

export class SenderDonateCommand {
  constructor(
    public readonly paymentToken: string,
    public readonly chargeProvider: Provider,
    public readonly chargeToken: string,
    public readonly amountInCents: number,
    public readonly personalizedNote: string,
  ) {}
}
