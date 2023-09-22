import { Injectable } from '@nestjs/common';
import { UserJoinedEvent } from '@app/events/user/user-joined.event';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { UserTask } from '@app/interfaces/user/user.enums';

import { CreateTaskCommand } from './create-task.command';

@EventHandler(UserJoinedEvent, 'user-create-task')
@Injectable()
export default class UserSettingsUserJoinedEventHandler
  implements IEventHandler<UserJoinedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: UserJoinedEvent): Promise<void> {
    const { userId } = event;
    await this.commandBus.execute(
      new CreateTaskCommand(userId, UserTask.ConnectFirstAccount),
    );
    await this.commandBus.execute(
      new CreateTaskCommand(userId, UserTask.ChooseNonprofit),
    );
    await this.commandBus.execute(
      new CreateTaskCommand(userId, UserTask.ReviewAllowList),
    );
    await this.commandBus.execute(
      new CreateTaskCommand(userId, UserTask.TakeTour),
    );
  }
}
