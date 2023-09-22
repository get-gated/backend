import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

import DecisionEntity from '../../entities/decision.entity';

import { StatsQuery } from './stats.query';

export interface TStatsHandlerResponse {
  total: number;
  gated: number;
  muted: number;
  allowed: number;
  ignored: number;
}

@QueryHandler(StatsQuery)
export class StatsQueryHandler implements IQueryHandler<StatsQuery> {
  constructor(
    @InjectRepository(DecisionEntity)
    private decisionRepo: EntityRepository<DecisionEntity>,
  ) {}

  async execute(query: StatsQuery): Promise<any> {
    const { userId, endDate, startDate } = query;
    const where = {
      userId,
      decidedAt: { $gte: startDate, $lte: endDate },
    };

    const [gated, muted, allowed, ignored] = await Promise.all([
      this.decisionRepo.count({
        ...where,
        ruling: Rule.Gate,
      }),
      this.decisionRepo.count({
        ...where,
        ruling: Rule.Mute,
      }),
      this.decisionRepo.count({
        ...where,
        ruling: Rule.Allow,
      }),
      this.decisionRepo.count({
        ...where,
        ruling: Rule.Ignore,
      }),
    ]);
    const total = gated + muted + allowed + ignored;
    return { gated, muted, allowed, ignored, total };
  }
}
