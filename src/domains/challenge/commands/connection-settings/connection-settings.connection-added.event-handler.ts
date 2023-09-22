import { Injectable } from '@nestjs/common';
import { ConnectionAddedEvent } from '@app/events/service-provider/connection-added.event';
import { EventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { ChallengeMode } from '@app/interfaces/challenge/challenge.enums';

import { ConnectionSettingsCommand } from './connection-settings.command';

@EventHandler(ConnectionAddedEvent, 'challenge-connection-settings-command')
@Injectable()
export default class ConnectionSettingsConnectionAddedEventHandler {
  constructor(private commandBus: CommandBus) {}

  async handler(event: ConnectionAddedEvent): Promise<unknown> {
    const { userId, connectionId } = event;

    return this.commandBus.execute(
      new ConnectionSettingsCommand(connectionId, userId, ChallengeMode.Send),
    );
  }
}
