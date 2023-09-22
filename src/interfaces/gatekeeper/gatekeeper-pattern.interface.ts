import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

export default abstract class GatekeeperPatternInterface {
  public readonly patternId: string;

  public readonly name: string;

  public readonly description?: string;

  public readonly expression: string;

  public readonly rule: Rule;

  public readonly createdAt: Date;

  public readonly updatedAt: Date;

  public readonly deletedAt?: Date;

  constructor(props: GatekeeperPatternInterface) {
    this.patternId = props.patternId;
    this.name = props.name;
    this.description = props.description;
    this.expression = props.expression;
    this.rule = props.rule;
    this.createdAt = new Date(props.createdAt);
    this.deletedAt = props.deletedAt && new Date(props.deletedAt);
    this.updatedAt = new Date(props.updatedAt);
  }
}
