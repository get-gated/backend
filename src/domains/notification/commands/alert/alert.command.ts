export class AlertCommand {
  constructor(
    public readonly to: string,
    public readonly subject: string,
    public readonly html: string,
    public readonly replyTo?: string,
  ) {}
}
