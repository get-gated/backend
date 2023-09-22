import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import ChallengeUserSettingEntity from '../../entities/user-setting.entity';
import UserEntity from '../../../user/entities/user.entity';

import { ChallengeUserSettingsQuery } from './user-settings.query';

@Resolver(() => UserEntity)
export class UserSettingsGraphqlResolvers {
  constructor(private queryBus: QueryBus) {}

  @Query(() => ChallengeUserSettingEntity, { name: 'challengeSettings' })
  @Allow(Role.User)
  async queryChallengeSettings(
    @User() { userId }: AuthedUser,
  ): Promise<ChallengeUserSettingEntity> {
    return this.getUserChallengeSettings(userId);
  }

  @ResolveField(() => ChallengeUserSettingEntity)
  async challengeSettings(
    @Parent() { userId }: UserEntity,
  ): Promise<ChallengeUserSettingEntity> {
    return this.getUserChallengeSettings(userId);
  }

  private async getUserChallengeSettings(
    userId: string,
  ): Promise<ChallengeUserSettingEntity> {
    return this.queryBus.execute(new ChallengeUserSettingsQuery(userId));
  }
}
