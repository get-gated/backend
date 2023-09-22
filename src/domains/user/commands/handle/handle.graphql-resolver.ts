import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import UserEntity from '../../entities/user.entity';

import { HandleCommand } from './handle.command';
import { HandleRequestDto } from './handle.request.dto';

@Resolver()
export class HandleGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => UserEntity)
  @Allow(Role.User)
  async userHandle(
    @Args('input') { handle }: HandleRequestDto,
    @User() { userId }: AuthedUser,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<UserEntity> {
    await this.commandBus.execute(new HandleCommand(userId, handle));
    return loaders.user.load(userId);
  }
}
