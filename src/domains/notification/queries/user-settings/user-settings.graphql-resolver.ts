import { Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import UserSettingsEntity from '../../entities/user-settings.entity';

import { NotificationUserSettingsQuery } from './user-settings.query';

@Resolver()
export class UserSettingsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => UserSettingsEntity)
  @Allow(Role.User)
  async notificationUserSettings(
    @User() { userId }: AuthedUser,
  ): Promise<UserSettingsEntity> {
    return this.queryBus.execute(new NotificationUserSettingsQuery(userId));
  }
}
