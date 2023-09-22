export class MoveTxEmailToInboxCommand {
  constructor(
    public readonly connectionId: string,
    public readonly threadId: string,
  ) {}
}
