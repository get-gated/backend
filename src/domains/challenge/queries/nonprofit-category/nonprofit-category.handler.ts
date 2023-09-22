import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';

import { NonprofitCategoryQuery } from './nonprofit-category.query';

@QueryHandler(NonprofitCategoryQuery)
export class NonprofitCategoryHandler
  implements IQueryHandler<NonprofitCategoryQuery>
{
  constructor(
    @InjectRepository(NonprofitCategoryEntity)
    private nonprofitCategoryRepo: EntityRepository<NonprofitCategoryEntity>,
  ) {}

  async execute(
    query: NonprofitCategoryQuery,
  ): Promise<NonprofitCategoryEntity[]> {
    return this.nonprofitCategoryRepo.find({
      nonprofitCategoryId: { $in: query.nonprofitCategoryIds },
    });
  }
}
