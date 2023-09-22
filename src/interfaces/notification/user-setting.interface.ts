export abstract class NotificationUserSettingInterface {
  public readonly userSettingId: string;

  public readonly userId: string;

  public readonly email: string;

  constructor(props: NotificationUserSettingInterface) {
    this.userSettingId = props.userSettingId;
    this.userId = props.userId;
    this.email = props.email;
  }
}
