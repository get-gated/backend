import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';

import { NonprofitCategoriesQuery } from './nonprofit-categories.query';

@QueryHandler(NonprofitCategoriesQuery)
export class NonprofitCategoriesQueryHandler
  implements IQueryHandler<NonprofitCategoriesQuery>
{
  constructor(
    @InjectRepository(NonprofitCategoryEntity)
    private nonprofitCategoryRepo: EntityRepository<NonprofitCategoryEntity>,
  ) {}

  async execute(): Promise<NonprofitCategoryEntity[]> {
    return this.nonprofitCategoryRepo.findAll();
  }
}
