import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

export class DecisionCountQuery {
  constructor(
    public userId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly ruling?: Rule,
    public readonly connectionId?: string,
  ) {}
}
