import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';

import { ChallengeStatsQuery } from './challenge-stats.query';

export interface ChallengeStatsQueryHandlerResponse {
  donationTotal: number;
  donationCount: number;
  donationAllTimeHigh: number;
  challengesSent: number;
}

@QueryHandler(ChallengeStatsQuery)
export class ChallengeStatsQueryHandler
  implements IQueryHandler<ChallengeStatsQuery>
{
  constructor(private em: EntityManager) {}

  async execute(
    query: ChallengeStatsQuery,
  ): Promise<ChallengeStatsQueryHandlerResponse> {
    const { userId } = query;

    const [
      { donationTotal, donationCount, donationAllTimeHigh, challengesSent },
    ] = await this.em
      .createQueryBuilder(ChallengeInteractionEntity, 'us')
      .select([
        'sum(payment_amount) as "donationTotal"',
        'count(payment_amount) as "donationCount"',
        'count(*) as "challengesSent"',
        'max(payment_amount) as "donationAllTimeHigh"',
      ])
      .where({ challenge: { userId } })
      .execute();

    return {
      donationTotal: donationTotal || 0,
      donationCount,
      donationAllTimeHigh: donationAllTimeHigh || 0,
      challengesSent,
    };
  }
}
