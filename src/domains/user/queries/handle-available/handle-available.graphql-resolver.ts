import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';

import { HandleAvailableRequestDto } from './handle-available.request.dto';
import { HandleAvailableQuery } from './handle-available.query';

@Resolver()
export class HandleAvailableGraphqlResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Allow(SpecialRole.AllAuthenticated)
  @Query(() => Boolean)
  public async userHandleAvailable(
    @Args('input') { handle }: HandleAvailableRequestDto,
  ): Promise<any> {
    return this.queryBus.execute(new HandleAvailableQuery(handle));
  }
}
