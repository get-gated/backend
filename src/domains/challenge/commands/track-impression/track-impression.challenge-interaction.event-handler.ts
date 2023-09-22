import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeInteractionEvent } from '@app/events/challenge/challenge-interaction.event';
import { CommandBus } from '@nestjs/cqrs';
import {
  ChallengeInteraction,
  ImpressionSource,
} from '@app/interfaces/challenge/challenge.enums';

import { TrackImpressionCommand } from './track-impression.command';

@EventHandler(ChallengeInteractionEvent, 'track-impression')
export class TrackImpressionChallengeInteractionEventHandler
  implements IEventHandler<ChallengeInteractionEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ChallengeInteractionEvent): Promise<void> {
    if (event.interaction !== ChallengeInteraction.Opened) return;

    await this.commandBus.execute(
      new TrackImpressionCommand(
        event.challenge.userId,
        event.challenge.nonprofit.nonprofitId,
        ImpressionSource.ChallengeEmail,
      ),
    );
  }
}
