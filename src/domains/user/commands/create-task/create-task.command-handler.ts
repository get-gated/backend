import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EventBusService } from '@app/modules/event-bus';
import { UserTaskCreatedEvent } from '@app/events/user/user-task-created.event';

import UserEntity from '../../entities/user.entity';
import UserTaskEntity from '../../entities/task.entity';

import { CreateTaskCommand } from './create-task.command';

@CommandHandler(CreateTaskCommand)
export class CreateTaskCommandHandler
  implements ICommandHandler<CreateTaskCommand>
{
  constructor(
    @InjectRepository(UserTaskEntity)
    private taskRepo: EntityRepository<UserTaskEntity>,
    @InjectRepository(UserEntity)
    private userRepo: EntityRepository<UserEntity>,
    private eventBus: EventBusService,
  ) {}

  async execute(command: CreateTaskCommand): Promise<void> {
    const { userId, task } = command;

    const newTask = new UserTaskEntity({
      user: this.userRepo.getReference(userId),
      task,
    });

    await this.taskRepo.persistAndFlush(newTask);

    await this.eventBus.publish(new UserTaskCreatedEvent(newTask));
  }
}
