import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ChallengeInteraction,
  ChallengeInteractionUserRepliedTo,
} from '@app/interfaces/challenge/challenge.enums';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { LoggerService } from '@app/modules/logger';

import { ChallengeService } from '../../services/challenge.service';
import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';
import ChallengeEntity from '../../entities/challenge.entity';

import MarkUserRepliedCommand from './mark-user-replied.command';

@CommandHandler(MarkUserRepliedCommand)
export class MarkUserRepliedHandler
  implements ICommandHandler<MarkUserRepliedCommand>
{
  constructor(
    private challengeService: ChallengeService,
    private log: LoggerService,
    @InjectRepository(ChallengeInteractionEntity)
    private interactionRepo: EntityRepository<ChallengeInteractionEntity>,
    @InjectRepository(ChallengeEntity)
    private challengeRepo: EntityRepository<ChallengeEntity>,
  ) {}

  public async execute(command: MarkUserRepliedCommand): Promise<void> {
    this.log.info({ command }, 'Executing MarkUserReplied Command');
    const { challengeId, userReplyMessageId } = command;

    const donatedOrExpectedInteraction = await this.interactionRepo.findOne({
      challenge: this.challengeRepo.getReference(challengeId),
      interaction: {
        $in: [ChallengeInteraction.Donated, ChallengeInteraction.Expected],
      },
    });

    const userRepliedToInteraction =
      <ChallengeInteractionUserRepliedTo>(
        donatedOrExpectedInteraction?.interaction
      ) || undefined;

    try {
      await this.challengeService.recordInteraction(
        challengeId,
        ChallengeInteraction.UserReplied,
        undefined,
        userReplyMessageId,
        undefined,
        userRepliedToInteraction,
      );
    } catch (error) {
      this.log.error({ error }, 'MarkUserRepliedCommand failed');
      throw error;
    }
  }
}
