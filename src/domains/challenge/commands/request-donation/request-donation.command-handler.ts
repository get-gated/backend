import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EventBusService } from '@app/modules/event-bus';
import { DonationRequestedEvent } from '@app/events/challenge/donation-requested.event';
import { wrap } from '@mikro-orm/core';
import { isUndefined, omitBy } from 'lodash';

import ChallengeUserSettingEntity from '../../entities/user-setting.entity';
import NonprofitEntity from '../../entities/nonprofit.entity';
import DonationRequestEntity from '../../entities/donation-request.entity';

import { RequestDonationCommand } from './request-donation.command';

@CommandHandler(RequestDonationCommand)
export class RequestDonationCommandHandler
  implements ICommandHandler<RequestDonationCommand>
{
  constructor(
    @InjectRepository(DonationRequestEntity)
    private donationReqRepo: EntityRepository<DonationRequestEntity>,
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
    @InjectRepository(ChallengeUserSettingEntity)
    private settingsRepo: EntityRepository<ChallengeUserSettingEntity>,
    private eventBus: EventBusService,
  ) {}

  async execute(command: RequestDonationCommand): Promise<any> {
    const {
      amountInCents,
      memo,
      userId,
      nonprofitId,
      thankYouMessage,
      type,
      allowExemptionRequest,
      isFeatured,
      cta,
      name,
      donationRequestId,
    } = command;

    const settings = await this.settingsRepo.findOneOrFail({ userId });

    const nonprofit = nonprofitId
      ? this.nonprofitRepo.getReference(nonprofitId)
      : settings.nonprofit;

    let request: DonationRequestEntity;

    if (!donationRequestId) {
      request = new DonationRequestEntity({
        memo,
        userId,
        amountInCents,
        nonprofit,
        type,
        thankYouMessage,
        allowExemptionRequest: !!allowExemptionRequest,
        isFeatured: !!isFeatured,
        isActive: true,
        cta,
        name,
      });
    } else {
      request = await this.donationReqRepo.findOneOrFail(donationRequestId);
      wrap(request).assign(omitBy(command, isUndefined));
    }

    await this.donationReqRepo.persistAndFlush(request);

    await this.eventBus.publish(new DonationRequestedEvent(request));

    return request.donationRequestId;
  }
}
