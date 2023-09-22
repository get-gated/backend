import ChallengeNonprofitInterface from '@app/interfaces/challenge/challenge-nonprofit.interface';
import { DonationRequestType } from '@app/interfaces/challenge/challenge.enums';

export abstract class DonationRequestInterface {
  public readonly donationRequestId: string;

  public readonly userId: string;

  public readonly name?: string;

  public readonly nonprofit: ChallengeNonprofitInterface;

  public readonly amountInCents: number;

  public readonly memo: string;

  public readonly thankYouMessage?: string;

  public readonly createdAt: Date;

  public readonly type: DonationRequestType;

  public readonly allowExemptionRequest: boolean;

  public readonly isActive: boolean;

  public readonly isFeatured?: boolean;

  public readonly cta?: string;

  constructor(props: DonationRequestInterface) {
    this.donationRequestId = props.donationRequestId;
    this.name = props.name;
    this.userId = props.userId;
    this.nonprofit = props.nonprofit;
    this.amountInCents = props.amountInCents;
    this.createdAt = new Date(props.createdAt);
    this.memo = props.memo;
    this.thankYouMessage = props.thankYouMessage;
    this.type = props.type;
    this.allowExemptionRequest = props.allowExemptionRequest;
    this.isActive = props.isActive;
    this.isFeatured = props.isFeatured;
    this.cta = props.cta;
  }
}
