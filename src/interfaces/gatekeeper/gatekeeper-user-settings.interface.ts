export default abstract class GatekeeperUserSettingsInterface {
  public readonly userSettingId: string;

  public readonly userId: string;

  public readonly isInjectDecisionsEnabled: boolean;

  public readonly updatedAt: Date;

  constructor(props: GatekeeperUserSettingsInterface) {
    this.userSettingId = props.userSettingId;
    this.userId = props.userId;
    this.isInjectDecisionsEnabled = props.isInjectDecisionsEnabled;
    this.updatedAt = new Date(props.updatedAt);
  }
}
