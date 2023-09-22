import { Injectable } from '@nestjs/common';
import { ChallengeInteractionEvent } from '@app/events/challenge/challenge-interaction.event';
import { CommandBus } from '@nestjs/cqrs';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

import { MoveThreadCommand } from './move-thread.command';

@EventHandler(ChallengeInteractionEvent, 'service-provider-move-thread')
@Injectable()
export default class MoveThreadChallengeInteractionEventHandler
  implements IEventHandler<ChallengeInteractionEvent>
{
  constructor(private commandBus: CommandBus) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handler(event: ChallengeInteractionEvent): Promise<any> {
    const { interaction } = event;
    const { connectionId, threadId } = event.challenge;

    let command: MoveThreadCommand;

    switch (interaction) {
      case ChallengeInteraction.UserExpectedConsentGranted:
        command = new MoveThreadCommand(connectionId, threadId, Label.Inbox);
        break;
      case ChallengeInteraction.Donated:
        command = new MoveThreadCommand(connectionId, threadId, Label.Donation);
        break;
      default:
        return;
    }

    return this.commandBus.execute(command);
  }
}
