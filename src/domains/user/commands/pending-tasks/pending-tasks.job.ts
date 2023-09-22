import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IJob, Job } from '@app/modules/job';
import { AsyncContextService } from '@app/modules/async-context';
import { LoggerService } from '@app/modules/logger';
import { hoursAgoFromDate } from '@app/modules/utils';
import { UserTask, UserTaskResolution } from '@app/interfaces/user/user.enums';
import { EventBusService } from '@app/modules/event-bus';
import { UserTaskPendingEvent } from '@app/events/user/user-task-pending.event';

import UserTaskEntity from '../../entities/task.entity';
import UserConfig from '../../user.config';

@Job('PendingTasks')
export class PendingTasksJob implements IJob {
  constructor(
    @Inject(UserConfig.KEY) private config: ConfigType<typeof UserConfig>,
    private readonly eventBus: EventBusService,
    private log: LoggerService,
    @InjectRepository(UserTaskEntity)
    private userTaskRepo: EntityRepository<UserTaskEntity>,
    private ac: AsyncContextService,
  ) {}

  async run(): Promise<void> {
    this.ac.register();
    const startDate = hoursAgoFromDate(
      new Date(),
      this.config.userTaskPendingThresholdHours,
    );
    const userTasks = await this.userTaskRepo.find({
      resolution: null,
      resolvedAt: null,
      createdAt: { $lt: startDate },
      task: UserTask.ConnectFirstAccount,
      user: { isDisabled: false },
    });

    if (!userTasks.length) {
      this.log.info('No matching tasks found');
      return;
    }

    userTasks.forEach((task) => {
      task.resolution = UserTaskResolution.Pending;
    });
    this.log.info(
      `Found ${userTasks.length} tasks. Transitioning to pending status.`,
    );
    await this.userTaskRepo.persistAndFlush(userTasks);

    this.log.info('Publishing events.');
    await Promise.all([
      userTasks.map((task) =>
        this.eventBus.publish(new UserTaskPendingEvent(task)),
      ),
    ]);
  }
}
