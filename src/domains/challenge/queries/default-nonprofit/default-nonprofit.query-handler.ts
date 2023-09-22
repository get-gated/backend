import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import NonprofitEntity from '../../entities/nonprofit.entity';

import { DefaultNonprofitQuery } from './default-nonprofit.query';

@QueryHandler(DefaultNonprofitQuery)
export class DefaultNonprofitQueryHandler
  implements IQueryHandler<DefaultNonprofitQuery>
{
  constructor(
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  async execute(): Promise<NonprofitEntity> {
    return this.nonprofitRepo.findOneOrFail({ isDefault: true });
  }
}
