import { Rule, TrainingOrigin } from './gatekeeper.enums';

export default abstract class GatekeeperTrainingInterface {
  public readonly trainingId: string;

  public readonly userId: string;

  public readonly username?: string;

  public readonly domain: string;

  public readonly rule: Rule;

  public readonly origin: TrainingOrigin;

  public readonly createdAt: Date;

  constructor(props: GatekeeperTrainingInterface) {
    this.trainingId = props.trainingId;
    this.userId = props.userId;
    this.username = props.username;
    this.domain = props.domain;
    this.rule = props.rule;
    this.origin = props.origin;
    this.createdAt = new Date(props.createdAt);
  }
}
