import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

export class AddPatternCommand {
  constructor(
    public readonly name: string,
    public readonly expression: string,
    public readonly rule: Rule,
    public readonly description?: string,
  ) {}
}
