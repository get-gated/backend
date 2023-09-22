export default class MarkUserRepliedCommand {
  constructor(
    public readonly challengeId: string,
    public readonly userReplyMessageId: string,
  ) {}
}
