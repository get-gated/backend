export class UpdateNonprofitCategoryCommand {
  constructor(
    readonly nonprofitCategoryId: string,
    readonly name: string,
    readonly description: string,
  ) {}
}
