import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, SpecialRole, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import UserEntity from '../../entities/user.entity';

import { UpdateUserCommand } from './update-user.command';
import { UpdateUserRequest } from './update-user.request.dto';

@Resolver()
export class UpdateUserGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => UserEntity)
  @Allow(SpecialRole.AllAuthenticated)
  async userUpdate(
    @Args('input') { firstName, lastName, avatar }: UpdateUserRequest,
    @User() { userId }: AuthedUser,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<UserEntity> {
    await this.commandBus.execute(
      new UpdateUserCommand(userId, firstName, lastName, avatar),
    );
    return loaders.user.load(userId);
  }
}
