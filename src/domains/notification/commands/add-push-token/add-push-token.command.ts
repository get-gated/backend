export class AddPushTokenCommand {
  constructor(
    public readonly userId: string,
    public readonly token: string,
    public readonly device: string,
  ) {}
}
