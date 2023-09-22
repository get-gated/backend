import { Args, Context, ID, Query, Resolver } from '@nestjs/graphql';
import { IGraphqlContext } from '@app/modules/graphql';
import { Allow, Role } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import NonprofitEntity from '../../entities/nonprofit.entity';
import { DefaultNonprofitQuery } from '../default-nonprofit/default-nonprofit.query';

@Resolver()
export class NonprofitGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => NonprofitEntity)
  @Allow([Role.User, Role.Admin])
  async nonprofit(
    @Args('id', { type: () => ID }) nonprofitId: string,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<NonprofitEntity> {
    return loaders.nonprofit.load(nonprofitId);
  }

  @Query(() => NonprofitEntity)
  @Allow([Role.User, Role.Admin])
  async nonprofitDefault(): Promise<NonprofitEntity> {
    return this.queryBus.execute(new DefaultNonprofitQuery());
  }
}
