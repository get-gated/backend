export class SendReplyCommand {
  constructor(
    public readonly connectionId: string,
    public readonly threadId: string,
    public readonly messageId: string,
    public readonly body: string,
    public readonly to: string,
  ) {}
}
