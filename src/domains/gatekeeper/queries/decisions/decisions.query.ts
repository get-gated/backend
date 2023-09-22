import { QueryOrder } from '@mikro-orm/core';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

interface IDecisionsQueryFilter {
  rulings?: Rule[];
  search?: string;
}

export class DecisionsQuery {
  constructor(
    public readonly userId: string,
    public readonly since: Date,
    public readonly order: QueryOrder,
    public readonly limit: number = 50,
    public readonly filter?: IDecisionsQueryFilter,
  ) {}
}
