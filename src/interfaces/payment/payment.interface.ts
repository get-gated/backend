import { Provider } from './payment.enums';

export abstract class PaymentInterface {
  paymentId: string;
  amountCents: number;
  provider: Provider;
  externalId?: string;
  initiator?: string;
  initiatorId?: string;
  createdAt: Date;
  note?: string;

  constructor(props: PaymentInterface) {
    this.paymentId = props.paymentId;
    this.provider = props.provider;
    this.externalId = props.externalId;
    this.amountCents = props.amountCents;
    this.initiator = props.initiator;
    this.initiatorId = props.initiatorId;
    this.createdAt = props.createdAt;
    this.note = props.note;
  }
}
