import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import NonprofitEntity from '../../entities/nonprofit.entity';

import { NonprofitBySlugQuery } from './nonprofit-by-slug.query';

@QueryHandler(NonprofitBySlugQuery)
export class NonprofitBySlugQueryHandler
  implements IQueryHandler<NonprofitBySlugQuery>
{
  constructor(
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  async execute(query: NonprofitBySlugQuery): Promise<any> {
    const { slug } = query;
    return this.nonprofitRepo.findOneOrFail(
      { slug },
      {
        populate: ['category'],
      },
    );
  }
}
