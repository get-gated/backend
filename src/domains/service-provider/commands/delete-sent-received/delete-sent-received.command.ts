export class DeleteSentReceivedCommand {
  constructor(public userId: string, public connectionId?: string) {}
}
