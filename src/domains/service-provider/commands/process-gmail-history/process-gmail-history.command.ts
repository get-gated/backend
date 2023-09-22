export class ProcessGmailHistoryCommand {
  constructor(
    public readonly connectionId: string,
    public readonly newHistoryId?: string, // if empty, will use from fetched history
  ) {}
}
