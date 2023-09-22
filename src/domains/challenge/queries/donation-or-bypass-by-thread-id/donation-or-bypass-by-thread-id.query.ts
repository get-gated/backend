export class DonationOrBypassByThreadIdQuery {
  constructor(
    public readonly userId: string,
    public readonly threadId: string,
  ) {}
}
