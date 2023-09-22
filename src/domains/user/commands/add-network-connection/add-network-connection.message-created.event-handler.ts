/* eslint-disable no-await-in-loop */
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { EmailMessageCreatedEvent } from '@app/events/service-provider/email-message-created.event';
import { CommandBus } from '@nestjs/cqrs';
import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';

import ChallengeAppService from '../../../challenge/challenge.app-service';

import { AddNetworkConnectionCommand } from './add-network-connection.command';

@EventHandler(EmailMessageCreatedEvent, 'add-network-connection')
export class AddNetworkConnectionMessageCreatedEventHandler
  implements IEventHandler<EmailMessageCreatedEvent>
{
  constructor(
    private commandBus: CommandBus,
    private challengeService: ChallengeAppService,
  ) {}

  async handler(event: EmailMessageCreatedEvent): Promise<void> {
    if (event.type !== MessageType.Sent) return; // ignore received messages
    if (event.wasSentBySystem === true) return; // ignore challenge messages

    const { userId, threadId } = event;
    const donationOrBypass =
      await this.challengeService.donationOrBypassByThreadId({
        userId,
        threadId,
      });

    const participants = [
      ...event.to,
      ...(event.cc ?? []),
      ...(event.bcc ?? []),
    ];

    for (let i = 0; i < participants.length; i++) {
      await this.commandBus.execute(
        new AddNetworkConnectionCommand(
          event.userId,
          participants[i].emailAddress,
          participants[i].displayName,
          undefined,
          Boolean(donationOrBypass),
        ),
      );
    }
  }
}
