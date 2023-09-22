import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';
import ChallengeEntity from '../../entities/challenge.entity';

import { ChallengeHasInteractionQuery } from './challenge-has-interaction.query';

@QueryHandler(ChallengeHasInteractionQuery)
export class ChallengeHasInteractionHandler
  implements IQueryHandler<ChallengeHasInteractionQuery>
{
  constructor(
    @InjectRepository(ChallengeEntity)
    private challengeRepo: EntityRepository<ChallengeEntity>,
    @InjectRepository(ChallengeInteractionEntity)
    private challengeInteractionRepo: EntityRepository<ChallengeInteractionEntity>,
  ) {}

  async execute(query: ChallengeHasInteractionQuery): Promise<boolean> {
    const { challengeId, interaction } = query;
    const challenge = await this.challengeRepo.findOne({ challengeId });
    const exists = await this.challengeInteractionRepo.count({
      challenge,
      interaction,
    });

    return Boolean(exists > 0);
  }
}
