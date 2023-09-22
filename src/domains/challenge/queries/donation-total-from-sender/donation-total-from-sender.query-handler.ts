import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UtilsService } from '@app/modules/utils';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';

import { DonationTotalFromSenderQuery } from './donation-total-from-sender.query';

export interface DonationTotalFromSenderQueryHandlerResponse {
  totalAmountInCents: number;
  donationsCount: number;
}

@QueryHandler(DonationTotalFromSenderQuery)
export class DonationTotalFromSenderQueryHandler
  implements IQueryHandler<DonationTotalFromSenderQuery>
{
  constructor(
    @InjectRepository(ChallengeInteractionEntity)
    private interactionRepo: EntityRepository<ChallengeInteractionEntity>,
    private utils: UtilsService,
  ) {}

  async execute(
    query: DonationTotalFromSenderQuery,
  ): Promise<DonationTotalFromSenderQueryHandlerResponse> {
    let to;
    if (!query.sender.includes('@') || query.sender[0] === '@') {
      const domain = query.sender.replace('@', '').toLowerCase();
      to = new RegExp(`.*@${domain}`);
    } else {
      to = this.utils.normalizeEmail(query.sender).email;
    }

    const donations = await this.interactionRepo.find(
      {
        challenge: { toNormalized: to, userId: query.userId },
        interaction: ChallengeInteraction.Donated,
      },
      {
        fields: ['paymentAmount'],
      },
    );

    let sum = 0;

    // eslint-disable-next-line no-return-assign
    donations.forEach((item) => (sum += item.paymentAmount ?? 0));
    return { totalAmountInCents: sum, donationsCount: donations.length };
  }
}
