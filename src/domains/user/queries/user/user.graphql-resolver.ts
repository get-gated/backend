import { Args, Context, ID, Query, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { IGraphqlContext } from '@app/modules/graphql';

import UserEntity from '../../entities/user.entity';

@Resolver()
export class UserGraphqlResolver {
  @Query(() => UserEntity)
  @Allow(Role.User)
  async me(
    @User() user: AuthedUser,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<UserEntity> {
    const res = await loaders.user.load(user.userId);
    return res;
  }

  @Query(() => UserEntity)
  @Allow(Role.Admin)
  async user(
    @Args('id', { type: () => ID }) userId: string,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<UserEntity> {
    return loaders.user.load(userId);
  }
}
