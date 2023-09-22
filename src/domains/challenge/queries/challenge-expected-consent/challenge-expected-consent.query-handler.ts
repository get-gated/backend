import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';
import ChallengeEntity from '../../entities/challenge.entity';

import { ChallengeExpectedConsentQuery } from './challenge-expected-consent.query';

export interface ChallengeExpectedConsentQueryHandlerResponse {
  challenge: ChallengeEntity;
  consentInteraction: ChallengeInteractionEntity;
  expectedInteraction: ChallengeInteractionEntity;
}
@QueryHandler(ChallengeExpectedConsentQuery)
export class ChallengeExpectedConsentQueryHandler
  implements
    IQueryHandler<
      ChallengeExpectedConsentQuery,
      ChallengeExpectedConsentQueryHandlerResponse
    >
{
  constructor(
    @InjectRepository(ChallengeInteractionEntity)
    private interactionRepo: EntityRepository<ChallengeInteractionEntity>,
  ) {}

  async execute(query: ChallengeExpectedConsentQuery): Promise<any> {
    const expectedInteraction = await this.interactionRepo.findOneOrFail(
      {
        expectedConsentId: query.consentId,
      },
      { populate: ['challenge'] },
    );

    const consentInteraction = await this.interactionRepo.findOne({
      challenge: expectedInteraction.challenge,
      interaction: {
        $in: [
          ChallengeInteraction.UserExpectedConsentGranted,
          ChallengeInteraction.UserExpectedConsentDenied,
        ],
      },
    });

    return {
      consentInteraction,
      expectedInteraction,
      challenge: expectedInteraction.challenge,
    };
  }
}
