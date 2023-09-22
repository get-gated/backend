/* eslint-disable no-await-in-loop */
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UserRemovedEvent } from '@app/events/user/user-removed.event';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionRemovedTrigger } from '@app/interfaces/service-provider/service-provider.enums';

import ConnectionRepository from '../../entities/repositories/connection.repository';

import { RemoveConnectionCommand } from './remove-connection.command';

@EventHandler(UserRemovedEvent, 'service-provider-remove-connection')
export class RemoveConnectionUserRemovedEventHandler
  implements IEventHandler<UserRemovedEvent>
{
  constructor(
    private commandBus: CommandBus,
    private connRepo: ConnectionRepository,
  ) {}

  async handler(event: UserRemovedEvent): Promise<void> {
    const { userId } = event;
    const connections = await this.connRepo.find({ userId, deletedAt: null });

    for (let i = 0; i < connections.length; i++) {
      await this.commandBus.execute(
        new RemoveConnectionCommand(
          userId,
          connections[i].connectionId,
          ConnectionRemovedTrigger.AccountRemoval,
          event.reasonText,
          event.experienceText,
        ),
      );
    }
  }
}
