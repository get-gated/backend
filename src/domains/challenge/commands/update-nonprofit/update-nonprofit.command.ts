export class UpdateNonprofitCommand {
  constructor(
    readonly nonprofitId: string,
    readonly name: string,
    readonly description: string,
    readonly categoryId: string,
    readonly isDisplayed: boolean,
    readonly logo?: string,
    readonly externalId?: string,
    readonly ein?: string,
    readonly url?: string,
  ) {}
}
