export class AddOptOutAddressCommand {
  constructor(
    public readonly userId: string,
    public readonly emailAddress: string,
  ) {}
}
