import { DonationRequestInterface } from '@app/interfaces/challenge/donation-request.interface';
import { DonationRequestInteraction } from '@app/interfaces/challenge/challenge.enums';

export abstract class DonationRequestInteractionInterface {
  public readonly donationRequestInteractionId: string;

  public readonly paymentId: string;

  public readonly request: DonationRequestInterface;

  public readonly amountInCents: number;

  public readonly note: string;

  public readonly performedAt: Date;

  public readonly interaction: DonationRequestInteraction;

  constructor(props: DonationRequestInteractionInterface) {
    this.donationRequestInteractionId = props.donationRequestInteractionId;
    this.amountInCents = props.amountInCents;
    this.paymentId = props.paymentId;
    this.performedAt = new Date(props.performedAt);
    this.note = props.note;
    this.request = props.request;
    this.interaction = props.interaction;
  }
}
