import {
  PaymentInitiator,
  Provider,
} from '@app/interfaces/payment/payment.enums';

export class ChargeCommand {
  constructor(
    public readonly provider: Provider,
    public readonly chargeToken: string,
    public readonly amountCents: number,
    public readonly initiator?: PaymentInitiator,
    public readonly initiatorId?: string,
    public readonly note?: string,
  ) {}
}
