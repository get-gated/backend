import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import DonationRequestInteractionEntity from '../../entities/donation-request-interaction.entity';

import { DonationQuery } from './donation.query';

@QueryHandler(DonationQuery)
export class DonationQueryHandler implements IQueryHandler<DonationQuery> {
  constructor(
    @InjectRepository(DonationRequestInteractionEntity)
    private interactionRepo: EntityRepository<DonationRequestInteractionEntity>,
  ) {}

  async execute(
    query: DonationQuery,
  ): Promise<DonationRequestInteractionEntity> {
    const { donationRequestInteractionId } = query;

    return this.interactionRepo.findOneOrFail(donationRequestInteractionId);
  }
}
