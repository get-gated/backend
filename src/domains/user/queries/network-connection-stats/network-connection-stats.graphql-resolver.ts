import { Query, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import { NetworkConnectionStatsQuery } from './network-connection-stats.query';
import { NetworkConnectionStatsResponseDto } from './network-connection-stats.response.dto';

@Resolver()
export class NetworkConnectionStatsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => NetworkConnectionStatsResponseDto)
  @Allow(Role.User)
  async networkConnectionStats(
    @User() { userId }: AuthedUser,
  ): Promise<NetworkConnectionStatsResponseDto> {
    return this.queryBus.execute(new NetworkConnectionStatsQuery(userId));
  }
}
