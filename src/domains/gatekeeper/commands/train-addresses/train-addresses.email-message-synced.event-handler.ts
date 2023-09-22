import { Injectable } from '@nestjs/common';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UtilsService } from '@app/modules/utils';
import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';
import { EmailMessageSyncedEvent } from '@app/events/service-provider/email-message-synced.event';

import { TrainAddressesCommand } from './train-addresses.command';

@EventHandler(EmailMessageSyncedEvent, 'gatekeeper-train-addresses-command')
@Injectable()
export default class TrainAddressesEmailMessageSyncedEventHandler
  implements IEventHandler<EmailMessageSyncedEvent>
{
  constructor(private commandBus: CommandBus, private utils: UtilsService) {}

  async handler(event: EmailMessageSyncedEvent): Promise<void> {
    if (event.type !== MessageType.Sent || event.wasSentBySystem) return;

    const participants = [
      ...event.to,
      ...(event.cc ?? []),
      ...(event.bcc ?? []),
    ];

    await this.commandBus.execute(
      new TrainAddressesCommand(
        event.userId,
        this.utils.getAddressesFromParticipants(participants),
        Rule.Allow,
        TrainingOrigin.SentEmail,
        true, // if the user has a rule, don't overwrite from sync
      ),
    );
  }
}
