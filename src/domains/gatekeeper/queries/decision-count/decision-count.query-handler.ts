import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { FilterQuery } from '@mikro-orm/core';

import DecisionEntity from '../../entities/decision.entity';

import { DecisionCountQuery } from './decision-count.query';

@QueryHandler(DecisionCountQuery)
export class DecisionCountQueryHandler
  implements IQueryHandler<DecisionCountQuery>
{
  constructor(
    @InjectRepository(DecisionEntity)
    private decisionRepo: EntityRepository<DecisionEntity>,
  ) {}

  async execute(query: DecisionCountQuery): Promise<any> {
    const { userId, startDate, endDate, connectionId, ruling } = query;
    const where: FilterQuery<DecisionEntity> = {
      userId,
      decidedAt: { $gt: startDate, $lt: endDate },
    };

    if (ruling) {
      where.ruling = ruling;
    }

    if (connectionId) {
      where.connectionId = connectionId;
    }

    return this.decisionRepo.count(where);
  }
}
