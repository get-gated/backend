import { Args, Query, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import { SearchUsersResponse } from './search-users.response.dto';
import { SearchUsersRequest } from './search-users.request.dto';
import { SearchUsersQuery } from './search-users.query';

@Resolver()
export class SearchUsersGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => SearchUsersResponse)
  @Allow(Role.Admin)
  async userSearch(
    @Args() { query }: SearchUsersRequest,
  ): Promise<SearchUsersResponse> {
    const results = await this.queryBus.execute(new SearchUsersQuery(query));
    return {
      results,
    };
  }
}
