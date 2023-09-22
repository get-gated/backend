import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import { VolumeStatEntity } from '../../entities/volume-stat.entity';

import { VolumeStatsQuery } from './volume-stats.query';
import { VolumeStatsRequestDto } from './volume-stats.request.dto';

@Resolver()
export class VolumeStatsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => VolumeStatEntity)
  @Allow(Role.User)
  async volumeStats(
    @User() { userId }: AuthedUser,
    @Args('input') { startAt, endAt }: VolumeStatsRequestDto,
  ): Promise<VolumeStatEntity> {
    return this.queryBus.execute(new VolumeStatsQuery(userId, startAt, endAt));
  }
}
