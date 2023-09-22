import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import NonprofitEntity from '../../entities/nonprofit.entity';

import { NonprofitsQuery } from './nonprofits.query';

@QueryHandler(NonprofitsQuery)
export class NonprofitsQueryHandler implements IQueryHandler<NonprofitsQuery> {
  constructor(
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  async execute(query: NonprofitsQuery): Promise<NonprofitEntity[]> {
    const where: { [key: string]: any } = {};
    if (query.isDisplay) {
      where.isDisplayed = true;
    }
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query.search) {
      where.name = { $ilike: `%${query.search}%` };
    }
    if (query.isFeatured) {
      where.isFeatured = true;
    }

    return this.nonprofitRepo.find(where);
  }
}
