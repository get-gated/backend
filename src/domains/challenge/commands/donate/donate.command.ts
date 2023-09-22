import { Provider } from '@app/interfaces/payment/payment.enums';

export class DonateCommand {
  constructor(
    public readonly donationRequestId: string,
    public readonly amountInCents: number,
    public readonly chargeProvider: Provider,
    public readonly chargeToken: string,
    public readonly note?: string,
  ) {}
}
