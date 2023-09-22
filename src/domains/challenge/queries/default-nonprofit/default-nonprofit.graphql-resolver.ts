import { Query, Resolver } from '@nestjs/graphql';
import { Allow, SpecialRole } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import NonprofitEntity from '../../entities/nonprofit.entity';

import { DefaultNonprofitQuery } from './default-nonprofit.query';

@Resolver()
export class DefaultNonprofitGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => NonprofitEntity)
  @Allow(SpecialRole.AllAuthenticated)
  async nonprofitDefault(): Promise<NonprofitEntity> {
    return this.queryBus.execute(new DefaultNonprofitQuery());
  }
}
