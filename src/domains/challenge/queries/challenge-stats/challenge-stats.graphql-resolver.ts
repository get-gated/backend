import { Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import { ChallengeStatsResponse } from './challenge-stats.response.dto';
import { ChallengeStatsQuery } from './challenge-stats.query';
import { ChallengeStatsQueryHandlerResponse } from './challenge-stats.query-handler';

@Resolver()
export class ChallengeStatsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => ChallengeStatsResponse)
  @Allow(Role.User)
  async challengeStats(
    @User() { userId }: AuthedUser,
  ): Promise<ChallengeStatsResponse> {
    const result: ChallengeStatsQueryHandlerResponse =
      await this.queryBus.execute(new ChallengeStatsQuery(userId));

    return result;
  }
}
