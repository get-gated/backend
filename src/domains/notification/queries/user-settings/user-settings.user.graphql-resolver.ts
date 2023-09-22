import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';

import UserEntity from '../../../user/entities/user.entity';
import UserSettingsEntity from '../../entities/user-settings.entity';

import { NotificationUserSettingsQuery } from './user-settings.query';

@Resolver(() => UserEntity)
export class UserSettingsUserGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @ResolveField(() => UserSettingsEntity)
  async notificationSettings(@Parent() parent: UserEntity): Promise<any> {
    return this.queryBus.execute(
      new NotificationUserSettingsQuery(parent.userId),
    );
  }
}
