export class RemoveOptOutAddressCommand {
  constructor(
    public readonly userId: string,
    public readonly optOutId: string,
  ) {}
}
