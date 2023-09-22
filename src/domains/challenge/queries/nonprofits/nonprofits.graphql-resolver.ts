import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';

import { NonprofitsQuery } from './nonprofits.query';
import { NonprofitsResponse } from './nonprofits.response.dto';
import { NonprofitsRequest } from './nonprofits.request.dto';

@Resolver()
export class NonprofitsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => NonprofitsResponse)
  @Allow(SpecialRole.AllAuthenticated)
  async nonprofits(
    @Args('input') input: NonprofitsRequest,
  ): Promise<NonprofitsResponse> {
    const { isDisplay = false, categoryId, search, isFeatured } = input;
    const nonprofits = await this.queryBus.execute(
      new NonprofitsQuery(isDisplay, categoryId, search, isFeatured),
    );
    return {
      nonprofits,
    };
  }
}
