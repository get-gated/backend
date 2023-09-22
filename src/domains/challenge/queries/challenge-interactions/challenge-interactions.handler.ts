import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';

import { ChallengeInteractionsQuery } from './challenge-interactions.query';

export interface TChallangeInteractionHandlerResponse {
  challengeInteractions: ChallengeInteractionEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(ChallengeInteractionsQuery)
export class ChallengeInteractionsHandler
  implements IQueryHandler<ChallengeInteractionsQuery>
{
  constructor(
    @InjectRepository(ChallengeInteractionEntity)
    private interactionRepo: EntityRepository<ChallengeInteractionEntity>,
  ) {}

  async execute(
    query: ChallengeInteractionsQuery,
  ): Promise<TChallangeInteractionHandlerResponse> {
    const { userId, challengeId, since, order, limit, interaction } = query;
    const direction = order === QueryOrder.DESC ? '$lt' : '$gt';
    const oppositeDirection = order === QueryOrder.DESC ? '$gt' : '$lt';

    const where: FilterQuery<ChallengeInteractionEntity> = {
      challenge: { userId, ...(challengeId ? { challengeId } : {}) },
    };

    if (interaction) {
      where.interaction = interaction;
    }

    const challengeInteractions = await this.interactionRepo.find(
      {
        ...where,
        performedAt: { [direction]: since },
      },
      {
        limit: limit + 1,
        orderBy: { performedAt: order },
      },
    );

    let hasNextPage;

    if (challengeInteractions.length === limit + 1) {
      challengeInteractions.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const otherDirectionResult = await this.interactionRepo.findOne(
      {
        ...where,
        performedAt: { [oppositeDirection]: since },
      },
      { fields: ['challengeInteractionId'] },
    );
    const hasPreviousPage = Boolean(otherDirectionResult);

    const total = await this.interactionRepo.count(where);

    return { challengeInteractions, hasNextPage, hasPreviousPage, total };
  }
}
