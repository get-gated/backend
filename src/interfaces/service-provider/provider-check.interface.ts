export abstract class ProviderCheckInterface {
  public readonly emailAddress: string;

  public readonly isGoogle: boolean;

  constructor(props: ProviderCheckInterface) {
    this.emailAddress = props.emailAddress;
    this.isGoogle = props.isGoogle;
  }
}
