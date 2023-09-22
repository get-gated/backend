import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import ChallengeEntity from '../../entities/challenge.entity';

import { ChallengesQuery } from './challenges.query';

export interface TChallengesForUserHandlerReturn {
  challenges: ChallengeEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(ChallengesQuery)
export class ChallengesHandler implements IQueryHandler<ChallengesQuery> {
  constructor(
    @InjectRepository(ChallengeEntity)
    private challenge: EntityRepository<ChallengeEntity>,
  ) {}

  async execute(
    query: ChallengesQuery,
  ): Promise<TChallengesForUserHandlerReturn> {
    const { userId, since, order, limit, recipient } = query;

    const direction = order === QueryOrder.DESC ? '$lt' : '$gt';
    const oppositeDirection = order === QueryOrder.DESC ? '$gt' : '$lt';
    const where: { [key: string]: any } = {};
    if (recipient) {
      where.to = { $like: `%${recipient}%` };
    }
    const challenges = await this.challenge.find(
      {
        userId,
        createdAt: { [direction]: since },
        ...where,
      },
      {
        limit: limit + 1,
        orderBy: { createdAt: order },
      },
    );

    let hasNextPage;

    if (challenges.length === limit + 1) {
      challenges.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const otherDirectionResult = await this.challenge.findOne(
      {
        userId,
        createdAt: { [oppositeDirection]: since },
      },
      { fields: ['challengeId'] },
    );

    const hasPreviousPage = Boolean(otherDirectionResult);

    const total = await this.challenge.count({ userId });

    return { challenges, hasPreviousPage, hasNextPage, total };
  }
}
