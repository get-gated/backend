export class DonationTotalFromSenderQuery {
  constructor(public readonly userId: string, public readonly sender: string) {}
}
