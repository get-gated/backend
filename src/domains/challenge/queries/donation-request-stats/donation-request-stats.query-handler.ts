import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { DonationRequestInteraction } from '@app/interfaces/challenge/challenge.enums';

import DonationRequestInteractionEntity from '../../entities/donation-request-interaction.entity';

import { DonationRequestStatsQuery } from './donation-request-stats.query';

export interface StatsQueryHandlerResponse {
  donationTotal: number;
  donationCount: number;
  viewCount: number;
}

@QueryHandler(DonationRequestStatsQuery)
export class DonationRequestStatsQueryHandler
  implements IQueryHandler<DonationRequestStatsQuery>
{
  constructor(private em: EntityManager) {}

  async execute(
    query: DonationRequestStatsQuery,
  ): Promise<StatsQueryHandlerResponse> {
    const { userId, donationRequestId } = query;

    const [{ donationTotal = 0, donationCount }] = await this.em
      .createQueryBuilder(DonationRequestInteractionEntity, 'i')
      .select([
        'sum(i.amount_in_cents) as "donationTotal"',
        'count(i.amount_in_cents) as "donationCount"',
      ])
      .where({
        request: {
          userId,
          ...(donationRequestId ? { donationRequestId } : {}),
        },
        interaction: DonationRequestInteraction.Donated,
      })
      .execute();

    const [{ viewCount }] = await this.em
      .createQueryBuilder(DonationRequestInteractionEntity, 'i')
      .select(['count(i.id) as "viewCount"'])
      .where({
        request: {
          userId,
          ...(donationRequestId ? { donationRequestId } : {}),
        },
        interaction: DonationRequestInteraction.Visited,
      })
      .execute();

    return { donationCount, donationTotal: donationTotal || 0, viewCount };
  }
}
