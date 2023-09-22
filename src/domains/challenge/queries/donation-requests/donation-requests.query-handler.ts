import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';

import DonationRequestEntity from '../../entities/donation-request.entity';

import { DonationRequestsQuery } from './donation-requests.query';

export interface DonationRequestsQueryHandlerResponse {
  requests: DonationRequestEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(DonationRequestsQuery)
export class DonationRequestsQueryHandler
  implements IQueryHandler<DonationRequestsQuery>
{
  constructor(
    @InjectRepository(DonationRequestEntity)
    private donationReqRepo: EntityRepository<DonationRequestEntity>,
  ) {}

  async execute(
    query: DonationRequestsQuery,
  ): Promise<DonationRequestsQueryHandlerResponse> {
    const { userId, since, order, limit, type, isActive } = query;
    const direction = order === QueryOrder.DESC ? '$lt' : '$gt';
    const oppositeDirection = order === QueryOrder.DESC ? '$gt' : '$lt';

    const where: FilterQuery<DonationRequestEntity> = {
      type,
      userId,
      deletedAt: null,
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const requests = await this.donationReqRepo.find(
      { ...where, createdAt: { [direction]: since } },
      { orderBy: { createdAt: order }, limit: limit + 1 },
    );

    let hasNextPage;

    if (requests.length === limit + 1) {
      requests.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const otherDirectionResult = await this.donationReqRepo.findOne(
      {
        ...where,
        createdAt: { [oppositeDirection]: since },
      },
      { fields: ['donationRequestId'] },
    );
    const hasPreviousPage = Boolean(otherDirectionResult);

    const total = await this.donationReqRepo.count(where);

    return { requests, hasNextPage, hasPreviousPage, total };
  }
}
