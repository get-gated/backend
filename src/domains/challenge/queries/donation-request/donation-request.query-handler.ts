import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';
import { DonationRequestType } from '@app/interfaces/challenge/challenge.enums';
import { Maybe } from '@app/modules/utils';

import DonationRequestEntity from '../../entities/donation-request.entity';
import DonationRequestInteractionEntity from '../../entities/donation-request-interaction.entity';

import { DonationRequestQuery } from './donation-request.query';

export interface DonationRequestQueryHandlerResponse {
  request: DonationRequestEntity;
  donatedInteraction: Maybe<DonationRequestInteractionEntity>;
}

@QueryHandler(DonationRequestQuery)
export class DonationRequestQueryHandler
  implements
    IQueryHandler<DonationRequestQuery, DonationRequestQueryHandlerResponse>
{
  constructor(
    @InjectRepository(DonationRequestEntity)
    private donationReqRepo: EntityRepository<DonationRequestEntity>,
    @InjectRepository(DonationRequestInteractionEntity)
    private donationReqInteractionRepo: EntityRepository<DonationRequestInteractionEntity>,
  ) {}

  async execute(
    query: DonationRequestQuery,
  ): Promise<DonationRequestQueryHandlerResponse> {
    const request = await this.donationReqRepo.findOne(
      query.donationRequestId,
      {
        populate: ['nonprofit'],
      },
    );

    if (!request || request.deletedAt) throw new NotFoundException();

    let donatedInteraction = null;
    if (request.type === DonationRequestType.SingleUse) {
      donatedInteraction = await this.donationReqInteractionRepo.findOne({
        request,
      });
    }

    return {
      donatedInteraction,
      request,
    };
  }
}
