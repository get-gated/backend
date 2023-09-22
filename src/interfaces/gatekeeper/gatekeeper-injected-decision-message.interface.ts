export default abstract class GatekeeperInjectedDecisionMessageInterface {
  public readonly injectedDecisionMessageId: string;

  public readonly userId: string;

  public readonly connectionId: string;

  public readonly threadId: string;

  public readonly messageId: string;

  public readonly decisionId: string;

  public readonly body: string;

  public readonly createdAt: Date;

  constructor(props: GatekeeperInjectedDecisionMessageInterface) {
    this.injectedDecisionMessageId = props.injectedDecisionMessageId;
    this.userId = props.userId;
    this.connectionId = props.connectionId;
    this.threadId = props.threadId;
    this.messageId = props.messageId;
    this.decisionId = props.decisionId;
    this.createdAt = new Date(props.createdAt);
    this.body = props.body;
  }
}
