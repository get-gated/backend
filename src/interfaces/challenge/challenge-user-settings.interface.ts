import ChallengeNonprofitInterface from '@app/interfaces/challenge/challenge-nonprofit.interface';

export default abstract class ChallengeUserSettingsInterface {
  public readonly challengeUserSettingId: string;

  public readonly userId: string;

  abstract nonprofit: ChallengeNonprofitInterface;

  public readonly minimumDonation: number;

  public readonly updatedAt: Date;

  public readonly signature: string;

  public readonly nonprofitReason?: string;

  public readonly injectResponses: boolean;

  constructor(props: ChallengeUserSettingsInterface) {
    this.challengeUserSettingId = props.challengeUserSettingId;
    this.userId = props.userId;
    this.minimumDonation = props.minimumDonation;
    this.updatedAt = new Date(props.updatedAt);
    this.signature = props.signature;
    this.nonprofitReason = props.nonprofitReason;
    this.injectResponses = !!props.injectResponses;
  }
}
