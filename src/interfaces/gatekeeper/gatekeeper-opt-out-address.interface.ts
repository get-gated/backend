export default abstract class GatekeeperOptOutAddressInterface {
  public readonly optOutId: string;

  public readonly userId: string;

  public readonly emailAddress: string;

  public readonly createdAt: Date;

  public readonly deletedAt?: Date;

  constructor(props: GatekeeperOptOutAddressInterface) {
    this.optOutId = props.optOutId;
    this.userId = props.userId;
    this.emailAddress = props.emailAddress;
    this.createdAt = new Date(props.createdAt);
    this.deletedAt = props.deletedAt && new Date(props.deletedAt);
  }
}
