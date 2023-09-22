import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { DonationRequestInteraction } from '@app/interfaces/challenge/challenge.enums';

import DonationRequestInteractionEntity from '../../entities/donation-request-interaction.entity';

import { DonationsQuery } from './donations.query';

export interface DonationsQueryHandlerResponse {
  donations: DonationRequestInteractionEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(DonationsQuery)
export class DonationsQueryHandler implements IQueryHandler<DonationsQuery> {
  constructor(
    @InjectRepository(DonationRequestInteractionEntity)
    private interactionRepo: EntityRepository<DonationRequestInteractionEntity>,
  ) {}

  async execute(query: DonationsQuery): Promise<DonationsQueryHandlerResponse> {
    const { userId, since, order, limit, donationRequestId } = query;
    const direction = order === QueryOrder.DESC ? '$lt' : '$gt';
    const oppositeDirection = order === QueryOrder.DESC ? '$gt' : '$lt';

    const where: FilterQuery<DonationRequestInteractionEntity> = {
      interaction: DonationRequestInteraction.Donated,
      request: {
        userId,
        ...(donationRequestId ? { donationRequestId } : {}),
      },
    };

    const donations = await this.interactionRepo.find(
      { ...where, performedAt: { [direction]: since } },
      {
        orderBy: { performedAt: order },
        limit: limit + 1,
        populate: ['request'],
      },
    );

    let hasNextPage;

    if (donations.length === limit + 1) {
      donations.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const otherDirectionResult = await this.interactionRepo.findOne(
      {
        ...where,
        performedAt: { [oppositeDirection]: since },
      },
      { fields: ['donationRequestInteractionId'] },
    );
    const hasPreviousPage = Boolean(otherDirectionResult);

    const total = await this.interactionRepo.count(where);

    return { donations, hasNextPage, hasPreviousPage, total };
  }
}
