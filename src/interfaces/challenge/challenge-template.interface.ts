export default class ChallengeTemplateInterface {
  public readonly challengeTemplateId: string;

  public readonly body: string;

  public readonly name: string;

  public readonly isEnabled: boolean;

  public readonly createdAt: Date;

  public readonly updatedAt?: Date;

  public readonly greetingBlock: string;

  public readonly leadBlock: string;

  public readonly donateBlock: string;

  public readonly expectedBlock: string;

  public readonly signatureBlock: string;

  constructor(props: ChallengeTemplateInterface) {
    this.challengeTemplateId = props.challengeTemplateId;
    this.body = props.body;
    this.name = props.name;
    this.isEnabled = props.isEnabled;
    this.createdAt = new Date(props.createdAt);
    this.updatedAt = props.updatedAt ? new Date(props.updatedAt) : new Date();
    this.greetingBlock = props.greetingBlock;
    this.leadBlock = props.leadBlock;
    this.donateBlock = props.donateBlock;
    this.expectedBlock = props.expectedBlock;
    this.signatureBlock = props.signatureBlock;
  }
}
