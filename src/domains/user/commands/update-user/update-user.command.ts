export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatar?: string,
  ) {}
}
