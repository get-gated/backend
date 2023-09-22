import { Provider, Status } from './service-provider.enums';

export abstract class ConnectionInterface {
  public readonly connectionId: string;

  public readonly userId: string;

  public readonly emailAddress: string;

  public readonly provider: Provider;

  public readonly status: Status;

  public readonly createdAt: Date;

  public readonly isActivated: boolean;

  public readonly isDisabled: boolean;

  public readonly deletedAt?: Date;

  public readonly updatedAt?: Date;

  constructor(props: ConnectionInterface) {
    this.connectionId = props.connectionId;
    this.userId = props.userId;
    this.emailAddress = props.emailAddress;
    this.provider = props.provider;
    this.status = props.status;
    this.createdAt = new Date(props.createdAt);
    this.isActivated = props.isActivated;
    this.isDisabled = props.isDisabled;
    this.deletedAt = props.deletedAt ? new Date(props.deletedAt) : undefined;
    this.updatedAt = props.updatedAt ? new Date(props.updatedAt) : undefined;
  }
}
