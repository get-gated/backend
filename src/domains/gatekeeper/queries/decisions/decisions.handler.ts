import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import DecisionEntity from '../../entities/decision.entity';

import { DecisionsQuery } from './decisions.query';

export interface TDecisionsHandlerResponse {
  decisions: DecisionEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(DecisionsQuery)
export class DecisionsHandler implements IQueryHandler<DecisionsQuery> {
  constructor(
    @InjectRepository(DecisionEntity)
    private decisionRepo: EntityRepository<DecisionEntity>,
  ) {}

  async execute(query: DecisionsQuery): Promise<TDecisionsHandlerResponse> {
    const { userId, since, order, limit, filter } = query;

    const direction = order === QueryOrder.DESC ? '$lt' : '$gt';
    const oppositeDirection = order === QueryOrder.DESC ? '$gt' : '$lt';
    const where: FilterQuery<DecisionEntity> = {
      userId,
    };

    if (filter?.rulings) {
      where.ruling = { $in: filter.rulings };
    }

    if (filter?.search) {
      where.emailAddress = { $like: `%${filter.search}%` };
    }

    const decisions = await this.decisionRepo.find(
      { ...where, decidedAt: { [direction]: since } },

      {
        limit: limit + 1,
        orderBy: { decidedAt: order },
      },
    );

    let hasNextPage;

    if (decisions.length === limit + 1) {
      decisions.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const otherDirectionResult = await this.decisionRepo.findOne(
      {
        decidedAt: { [oppositeDirection]: since },
      },
      { fields: ['decisionId'] },
    );

    const hasPreviousPage = Boolean(otherDirectionResult);
    const total = await this.decisionRepo.count(where);

    return { decisions, hasPreviousPage, hasNextPage, total };
  }
}
