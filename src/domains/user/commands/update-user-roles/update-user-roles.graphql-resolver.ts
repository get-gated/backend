import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import UserEntity from '../../entities/user.entity';

import { UpdateUserRolesRequest } from './update-user-roles.request.dto';
import { UpdateUserRolesCommand } from './update-user-roles.command';

@Resolver()
export class UpdateUserRolesGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => UserEntity)
  @Allow(Role.Admin)
  async userUpdateRoles(
    @Args() { roles, userId }: UpdateUserRolesRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<UserEntity> {
    await this.commandBus.execute(new UpdateUserRolesCommand(userId, roles));
    return loaders.user.load(userId);
  }
}
