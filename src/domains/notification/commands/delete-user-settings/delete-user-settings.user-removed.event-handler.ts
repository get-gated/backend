import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserRemovedEvent } from '@app/events/user/user-removed.event';
import { EventHandler } from '@app/modules/event-bus';

import { DeleteUserSettingsCommand } from './delete-user-settings.command';

@EventHandler(UserRemovedEvent, 'notification-delete-user-settings')
@Injectable()
export default class DeleteUserSettingsUserRemovedEventHandler {
  constructor(private commandBus: CommandBus) {}

  async handler({ userId }: UserRemovedEvent): Promise<void> {
    await this.commandBus.execute(new DeleteUserSettingsCommand(userId));
  }
}
