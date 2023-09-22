import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';

import { ChallengeInteractionQuery } from './challenge-interaction.query';

@QueryHandler(ChallengeInteractionQuery)
export class ChallengeInteractionHandler
  implements IQueryHandler<ChallengeInteractionQuery>
{
  constructor(
    @InjectRepository(ChallengeInteractionEntity)
    private interactionRepo: EntityRepository<ChallengeInteractionEntity>,
  ) {}

  async execute(
    query: ChallengeInteractionQuery,
  ): Promise<ChallengeInteractionEntity[]> {
    return this.interactionRepo.find({
      challengeInteractionId: { $in: query.challengeInteractionIds },
    });
  }
}
