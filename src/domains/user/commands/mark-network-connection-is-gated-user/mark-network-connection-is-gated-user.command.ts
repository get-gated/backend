export class MarkNetworkConnectionIsGatedUserCommand {
  constructor(
    public readonly emailAddress: string,
    public gatedUserId: string,
  ) {}
}
