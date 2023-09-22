export abstract class UserNetworkConnectionInterface {
  public readonly networkConnectionId: string;

  abstract userId: string;

  public readonly name: string;

  public readonly avatar?: string;

  public readonly externalIdentifier: string;

  abstract gatedUserId?: string;

  public readonly metWithGated: boolean;

  public readonly createdAt: Date;

  constructor(props: UserNetworkConnectionInterface) {
    this.networkConnectionId = props.networkConnectionId;
    this.name = props.name;
    this.avatar = props.avatar;
    this.externalIdentifier = props.externalIdentifier;
    this.createdAt = props.createdAt;
    this.metWithGated = props.metWithGated;
  }
}
