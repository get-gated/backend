import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UserJoinedEvent } from '@app/events/user/user-joined.event';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionAddedEvent } from '@app/events/service-provider/connection-added.event';
import { UserTask, UserTaskResolution } from '@app/interfaces/user/user.enums';
import { LoggerService } from '@app/modules/logger';

import { ResolveTaskCommand } from './resolve-task.command';

@EventHandler(UserJoinedEvent, 'resolve-task')
@Injectable()
export default class ResolveTaskConnectionAddedEventHandler
  implements IEventHandler<ConnectionAddedEvent>
{
  constructor(private commandBus: CommandBus, private log: LoggerService) {}

  async handler(event: ConnectionAddedEvent): Promise<void> {
    try {
      await this.commandBus.execute(
        new ResolveTaskCommand(
          event.userId,
          UserTask.ConnectFirstAccount,
          UserTaskResolution.Completed,
        ),
      );
    } catch {
      this.log.warn('Unable to mark ConnectFirstAccount as completed');
    }
  }
}
