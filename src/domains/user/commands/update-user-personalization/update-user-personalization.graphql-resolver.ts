import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import UserEntity from '../../entities/user.entity';

import { UpdateUserPersonalizationCommand } from './update-user-personalization.command';
import { UpdateUserPersonalizationRequest } from './update-user-personalization.request.dto';

@Resolver()
export class UpdateUserPersonalizationGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => UserEntity)
  @Allow(Role.User)
  async userUpdatePersonalization(
    @Args('input') { personalization }: UpdateUserPersonalizationRequest,
    @User() { userId }: AuthedUser,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<UserEntity> {
    await this.commandBus.execute(
      new UpdateUserPersonalizationCommand(userId, personalization),
    );
    return loaders.user.load(userId);
  }
}
