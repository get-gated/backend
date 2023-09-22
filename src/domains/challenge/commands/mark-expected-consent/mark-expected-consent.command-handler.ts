import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ChallengeInteraction,
  ExpectedConsent,
} from '@app/interfaces/challenge/challenge.enums';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';
import { ChallengeService } from '../../services/challenge.service';

import { MarkExpectedConsentCommand } from './mark-expected-consent.command';

@CommandHandler(MarkExpectedConsentCommand)
export class MarkExpectedConsentCommandHandler
  implements ICommandHandler<MarkExpectedConsentCommand>
{
  constructor(
    private challengeService: ChallengeService,
    @InjectRepository(ChallengeInteractionEntity)
    private interactionRepo: EntityRepository<ChallengeInteractionEntity>,
  ) {}

  async execute(command: MarkExpectedConsentCommand): Promise<void> {
    const { consentId, consentResponse } = command;

    const expectedInteraction = await this.interactionRepo.findOneOrFail(
      { expectedConsentId: consentId },
      { populate: ['challenge'] },
    );

    const { challengeId } = expectedInteraction.challenge;

    const interaction =
      consentResponse === ExpectedConsent.Granted
        ? ChallengeInteraction.UserExpectedConsentGranted
        : ChallengeInteraction.UserExpectedConsentDenied;

    const existing = await this.interactionRepo.findOne({
      challenge: this.interactionRepo.getReference(challengeId),
      interaction,
    });
    if (existing) return;

    await this.challengeService.recordInteraction(challengeId, interaction);
  }
}
