export class DonationRequestStatsQuery {
  constructor(
    public readonly userId: string,
    public readonly donationRequestId?: string,
  ) {}
}
