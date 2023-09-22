import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeInteractionEvent } from '@app/events/challenge/challenge-interaction.event';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';

import { TrainAddressesCommand } from './train-addresses.command';

@EventHandler(ChallengeInteractionEvent, 'gatekeeper-train-addresses-command')
@Injectable()
export default class TrainAddressesChallengeInteractionEventHandler
  implements IEventHandler<ChallengeInteractionEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ChallengeInteractionEvent): Promise<any> {
    if (event.interaction === ChallengeInteraction.UserExpectedConsentGranted) {
      return this.commandBus.execute(
        new TrainAddressesCommand(
          event.challenge.userId,
          [event.challenge.to],
          Rule.Allow,
          TrainingOrigin.ExpectedInteraction,
        ),
      );
    }

    if (event.interaction === ChallengeInteraction.UserExpectedConsentDenied) {
      return this.commandBus.execute(
        new TrainAddressesCommand(
          event.challenge.userId,
          [event.challenge.to],
          Rule.Mute,
          TrainingOrigin.ExpectedInteraction,
        ),
      );
    }
  }
}
