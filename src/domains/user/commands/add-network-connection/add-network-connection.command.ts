export class AddNetworkConnectionCommand {
  constructor(
    public readonly userId: string,
    public readonly externalIdentifier: string,
    public readonly name?: string,
    public readonly avatar?: string,
    public readonly metWithGated?: boolean,
    public readonly gatedUserId?: string,
  ) {}
}
