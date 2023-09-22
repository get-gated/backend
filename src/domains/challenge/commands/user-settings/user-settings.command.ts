export class UserSettingsCommand {
  constructor(
    public readonly userId: string,
    public readonly signature?: string,
    public readonly nonprofitId?: string,
    public readonly minimumDonation?: number,
    public readonly injectResponses?: boolean,
    public readonly nonprofitReason?: string,
  ) {}
}
