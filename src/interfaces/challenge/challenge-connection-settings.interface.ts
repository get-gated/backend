import { ChallengeMode } from '@app/interfaces/challenge/challenge.enums';

export default abstract class ChallengeConnectionSettingsInterface {
  public readonly challengeConnectionSettingId: string;

  public readonly userId: string;

  public readonly connectionId: string;

  abstract templateId?: string;

  public readonly mode: ChallengeMode;

  public readonly updatedAt: Date;

  public readonly greetingBlock?: string;

  public readonly leadBlock?: string;

  public readonly donateBlock?: string;

  public readonly expectedBlock?: string;

  public readonly signatureBlock?: string;

  constructor(props: Omit<ChallengeConnectionSettingsInterface, 'templateId'>) {
    this.challengeConnectionSettingId = props.challengeConnectionSettingId;
    this.userId = props.userId;
    this.connectionId = props.connectionId;
    this.mode = props.mode;
    this.updatedAt = new Date(props.updatedAt);
    this.greetingBlock = props.greetingBlock;
    this.leadBlock = props.leadBlock;
    this.donateBlock = props.donateBlock;
    this.expectedBlock = props.expectedBlock;
    this.signatureBlock = props.signatureBlock;
  }
}
