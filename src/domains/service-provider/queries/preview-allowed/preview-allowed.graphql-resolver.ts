import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, Role } from '@app/modules/auth';

import { PreviewAllowedQuery } from './preview-allowed.query';
import { PreviewAllowedResponse } from './preview-allowed.response.dto';

@Resolver()
export class PreviewAllowedGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => PreviewAllowedResponse)
  @Allow(Role.User)
  async previewAllowed(
    @Args('id', { type: () => ID }) connectionId: string,
  ): Promise<PreviewAllowedResponse> {
    const results = await this.queryBus.execute(
      new PreviewAllowedQuery(connectionId),
    );
    return { results };
  }
}
