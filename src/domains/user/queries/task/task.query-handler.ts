import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import UserTaskEntity from '../../entities/task.entity';

import { TaskQuery } from './task.query';

@QueryHandler(TaskQuery)
export class TaskQueryHandler implements IQueryHandler<TaskQuery> {
  constructor(
    @InjectRepository(UserTaskEntity)
    private taskRepo: EntityRepository<UserTaskEntity>,
  ) {}

  async execute(query: TaskQuery): Promise<UserTaskEntity[]> {
    const { taskIds } = query;
    const tasks = await this.taskRepo.find(taskIds);
    return tasks;
  }
}
