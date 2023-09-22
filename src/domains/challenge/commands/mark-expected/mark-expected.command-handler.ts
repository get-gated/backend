import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';
import { ChallengeService } from '../../services/challenge.service';

import { MarkExpectedCommand } from './mark-expected.command';

@CommandHandler(MarkExpectedCommand)
export class MarkExpectedCommandHandler
  implements ICommandHandler<MarkExpectedCommand>
{
  constructor(
    private challengeService: ChallengeService,
    @InjectRepository(ChallengeInteractionEntity)
    private interactionRepo: EntityRepository<ChallengeInteractionEntity>,
  ) {}

  async execute(command: MarkExpectedCommand): Promise<void> {
    const {
      challengeId,
      personalizedNote,
      expectedReason,
      expectedReasonDescription,
    } = command;

    const existing = await this.interactionRepo.findOne({
      challenge: this.interactionRepo.getReference(challengeId),
      interaction: ChallengeInteraction.Expected,
    });
    if (existing) return;
    await this.challengeService.recordInteraction(
      command.challengeId,
      ChallengeInteraction.Expected,
      undefined,
      undefined,
      undefined,
      undefined,
      personalizedNote,
      expectedReason,
      expectedReasonDescription,
    );
  }
}
