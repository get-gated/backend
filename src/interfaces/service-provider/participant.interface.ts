export abstract class ParticipantInterface {
  public readonly emailAddress: string;

  public readonly displayName?: string;

  constructor(props: ParticipantInterface) {
    this.emailAddress = props.emailAddress;
    this.displayName = props.displayName;
  }
}
