export class AddNonprofitCommand {
  constructor(
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
