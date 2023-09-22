export class OffboardCommand {
  constructor(
    public readonly userId: string,
    public readonly reasonText?: string,
    public readonly experienceText?: string,
  ) {}
}
