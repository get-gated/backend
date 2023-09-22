import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';

import { DonationOrBypassByThreadIdQuery } from './donation-or-bypass-by-thread-id.query';

@QueryHandler(DonationOrBypassByThreadIdQuery)
export class DonationOrBypassByThreadIdQueryHandler
  implements IQueryHandler<DonationOrBypassByThreadIdQuery>
{
  constructor(
    @InjectRepository(ChallengeInteractionEntity)
    private interactionRepo: EntityRepository<ChallengeInteractionEntity>,
  ) {}

  async execute(
    query: DonationOrBypassByThreadIdQuery,
  ): Promise<ChallengeInteractionEntity | null> {
    const { threadId, userId } = query;
    return this.interactionRepo.findOne({
      challenge: {
        threadId,
        userId,
      },
    });
  }
}
