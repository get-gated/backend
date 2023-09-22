import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import UserTaskEntity from '../../entities/task.entity';
import UserEntity from '../../entities/user.entity';

import { TasksQuery } from './tasks.query';

@QueryHandler(TasksQuery)
export class TasksQueryHandler implements IQueryHandler<TasksQuery> {
  constructor(
    @InjectRepository(UserTaskEntity)
    private taskRepo: EntityRepository<UserTaskEntity>,
    @InjectRepository(UserEntity)
    private userRepo: EntityRepository<UserEntity>,
  ) {}

  async execute(query: TasksQuery): Promise<UserTaskEntity[]> {
    const { userId, onlyUnresolved } = query;
    const tasks = await this.taskRepo.find({
      user: this.userRepo.getReference(userId),
      ...(onlyUnresolved ? { resolution: null } : {}),
    });
    return tasks;
  }
}
