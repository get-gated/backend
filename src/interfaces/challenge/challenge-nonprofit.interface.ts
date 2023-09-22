export default abstract class ChallengeNonprofitInterface {
  public readonly nonprofitId: string;

  public readonly name: string;

  public readonly logo?: string;

  public readonly art?: string;

  public readonly description: string;

  public readonly isDefault?: boolean;

  public readonly isDisplayed?: boolean;

  public readonly isFeatured?: boolean;

  public readonly slug?: string;

  public readonly externalId?: string;

  public readonly ein?: string;

  public readonly url?: string;

  abstract categoryId: string;

  constructor(props: ChallengeNonprofitInterface) {
    this.nonprofitId = props.nonprofitId;
    this.name = props.name;
    this.logo = props.logo;
    this.art = props.art;
    this.description = props.description;
    this.externalId = props.externalId;
    this.ein = props.ein;
    this.url = props.url;
    this.isDefault = !!props.isDefault;
    this.isFeatured = !!props.isFeatured;
    this.isDisplayed = !!props.isDisplayed;
    this.slug = props.slug;
  }
}
