import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import NonprofitEntity from '../../entities/nonprofit.entity';

import { NonprofitQuery } from './nonprofit.query';

@QueryHandler(NonprofitQuery)
export class NonprofitHandler implements IQueryHandler<NonprofitQuery> {
  constructor(
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  async execute(query: NonprofitQuery): Promise<NonprofitEntity[]> {
    return this.nonprofitRepo.find({
      nonprofitId: { $in: query.nonprofitIds },
    });
  }
}
