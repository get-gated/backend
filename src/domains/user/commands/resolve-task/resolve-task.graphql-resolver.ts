import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import UserTaskEntity from '../../entities/task.entity';

import { ResolveTaskRequestDto } from './resolve-task.request.dto';
import { ResolveTaskCommand } from './resolve-task.command';

@Resolver()
export class ResolveTaskGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => UserTaskEntity)
  @Allow(Role.User)
  async userTaskResolved(
    @Args('input') { task, resolution }: ResolveTaskRequestDto,
    @User() { userId }: AuthedUser,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<UserTaskEntity> {
    const taskId = await this.commandBus.execute(
      new ResolveTaskCommand(userId, task, resolution),
    );
    return loaders.userTask.load(taskId);
  }
}
