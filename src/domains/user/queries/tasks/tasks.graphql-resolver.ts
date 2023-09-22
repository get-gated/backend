import { Args, Query, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import UserTaskEntity from '../../entities/task.entity';

import { TasksRequestDto } from './tasks.request.dto';
import { TasksQuery } from './tasks.query';

@Resolver()
export class TasksGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => [UserTaskEntity])
  @Allow(Role.User)
  async userTasks(
    @User() { userId }: AuthedUser,
    @Args('input') { onlyUnresolved }: TasksRequestDto,
  ): Promise<UserTaskEntity[]> {
    return this.queryBus.execute(new TasksQuery(userId, onlyUnresolved));
  }
}
