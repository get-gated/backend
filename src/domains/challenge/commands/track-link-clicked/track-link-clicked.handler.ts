import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

import { ChallengeService } from '../../services/challenge.service';

import { TrackLinkClickedCommand } from './track-link-clicked.command';

@CommandHandler(TrackLinkClickedCommand)
export class TrackLinkClickedHandler
  implements ICommandHandler<TrackLinkClickedCommand>
{
  constructor(private challengeService: ChallengeService) {}

  async execute(command: TrackLinkClickedCommand): Promise<void> {
    await this.challengeService.recordInteraction(
      command.challengeId,
      ChallengeInteraction.Clicked,
    );
  }
}
