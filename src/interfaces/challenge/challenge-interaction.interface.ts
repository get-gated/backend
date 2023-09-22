import ChallengeInterface from '@app/interfaces/challenge/challenge.interface';

import {
  ChallengeInteractionUserRepliedTo,
  ExpectedReason,
  ChallengeInteraction as Interaction,
} from './challenge.enums';

export interface ChallengeInteraction {
  challengeInteractionId: string;
  interaction: Interaction;
  paymentId?: string;
  paymentAmount?: number;
  userReplyMessageId?: string;
  performedAt: Date;
  userRepliedToInteraction?: ChallengeInteractionUserRepliedTo;
  challenge: ChallengeInterface;
  personalizedNote?: string;
  expectedReason?: ExpectedReason;
  expectedReasonDescription?: string;
  expectedConsentId?: string;
}

export interface ChallengeInteractionDonated extends ChallengeInteraction {
  interaction: Interaction.Donated;
  paymentId: string;
  paymentAmount: number;
}

export abstract class ChallengeInteractionInterface
  implements ChallengeInteraction
{
  public readonly challengeInteractionId: string;

  public readonly interaction: Interaction;

  public readonly paymentId?: string;

  public readonly paymentAmount?: number;

  public readonly userReplyMessageId?: string;

  public readonly performedAt: Date;

  public readonly userRepliedToInteraction?: ChallengeInteractionUserRepliedTo;

  abstract challenge: ChallengeInterface;

  public readonly personalizedNote?: string;

  public readonly expectedReason?: ExpectedReason;

  public readonly expectedReasonDescription?: string;

  public readonly expectedConsentId?: string;

  constructor(props: ChallengeInteractionInterface) {
    this.challengeInteractionId = props.challengeInteractionId;
    this.interaction = props.interaction;
    this.paymentId = props.paymentId;
    this.paymentAmount = props.paymentAmount;
    this.userReplyMessageId = props.userReplyMessageId;
    this.performedAt = new Date(props.performedAt);
    this.userRepliedToInteraction = props.userRepliedToInteraction;
    this.personalizedNote = props.personalizedNote;
    this.expectedReason = props.expectedReason;
    this.expectedReasonDescription = props.expectedReasonDescription;
    this.expectedConsentId = props.expectedConsentId;
  }
}
