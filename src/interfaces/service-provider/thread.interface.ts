export abstract class ThreadInterface {
  public readonly userId: string;

  abstract connectionId: string;

  public readonly threadId: string;

  public readonly firstMessageAt: Date;

  constructor(props: ThreadInterface) {
    this.threadId = props.threadId;
    this.userId = props.userId;
    this.firstMessageAt = new Date(props.firstMessageAt);
  }
}
