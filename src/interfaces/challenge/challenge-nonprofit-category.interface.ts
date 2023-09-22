export default abstract class ChallengeNonprofitCategoryInterface {
  public readonly nonprofitCategoryId: string;

  public readonly name: string;

  public readonly description: string;

  abstract parentNonprofitCategoryId?: string;

  constructor(props: ChallengeNonprofitCategoryInterface) {
    this.nonprofitCategoryId = props.nonprofitCategoryId;
    this.name = props.name;
    this.description = props.description;
  }
}
