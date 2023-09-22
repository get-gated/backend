import { Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';

import { NonprofitCategoriesQuery } from './nonprofit-categories.query';
import { NonprofitCategoriesResponse } from './nonprofit-categories.response.dto';

@Resolver()
export class NonprofitCategoriesGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => NonprofitCategoriesResponse)
  @Allow(SpecialRole.AllAuthenticated)
  async nonprofitCategories(): Promise<NonprofitCategoriesResponse> {
    const nonprofitCategories = await this.queryBus.execute(
      new NonprofitCategoriesQuery(),
    );
    return {
      nonprofitCategories,
    };
  }
}
