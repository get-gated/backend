import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import DecisionEntity from '../../entities/decision.entity';

import { DecisionQuery } from './decision.query';

@QueryHandler(DecisionQuery)
export class DecisionHandler implements IQueryHandler<DecisionQuery> {
  constructor(
    @InjectRepository(DecisionEntity)
    private decisionRepo: EntityRepository<DecisionEntity>,
  ) {}

  async execute(query: DecisionQuery): Promise<DecisionEntity[]> {
    return this.decisionRepo.find({ decisionId: { $in: query.decisionIds } });
  }
}
