import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EventBusService } from '@app/modules/event-bus';
import { UserTaskResolvedEvent } from '@app/events/user/user-task-resolved.event';

import UserTaskEntity from '../../entities/task.entity';

import { ResolveTaskCommand } from './resolve-task.command';

@CommandHandler(ResolveTaskCommand)
export class ResolveTaskCommandHandler
  implements ICommandHandler<ResolveTaskCommand>
{
  constructor(
    @InjectRepository(UserTaskEntity)
    private taskRepo: EntityRepository<UserTaskEntity>,
    private eventBus: EventBusService,
  ) {}

  async execute(command: ResolveTaskCommand): Promise<string> {
    const { task, userId, resolution } = command;

    const taskEntity = await this.taskRepo.findOneOrFail({
      userId,
      task,
    });

    if (taskEntity.resolution === resolution) return taskEntity.taskId;

    taskEntity.resolution = resolution;
    taskEntity.resolvedAt = new Date();

    await this.taskRepo.persistAndFlush(taskEntity);

    await this.eventBus.publish(new UserTaskResolvedEvent(taskEntity));
    return taskEntity.taskId;
  }
}
