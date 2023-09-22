import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

import { ChallengeService } from '../../services/challenge.service';

import { TrackOpenedCommand } from './track-opened.command';

@CommandHandler(TrackOpenedCommand)
export class TrackOpenedHandler implements ICommandHandler<TrackOpenedCommand> {
  constructor(private challengeService: ChallengeService) {}

  async execute(command: TrackOpenedCommand): Promise<void> {
    await this.challengeService.recordInteraction(
      command.challengeId,
      ChallengeInteraction.Opened,
    );
  }
}
