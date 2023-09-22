import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from '@app/modules/logger';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { EventBusService } from '@app/modules/event-bus';
import { PaymentInitiator } from '@app/interfaces/payment/payment.enums';
import { DonationRequestReceivedEvent } from '@app/events/challenge/donation-request-received.event';
import {
  DonationRequestInteraction,
  DonationRequestType,
} from '@app/interfaces/challenge/challenge.enums';

import DonationRequestEntity from '../../entities/donation-request.entity';
import DonationRequestInteractionEntity from '../../entities/donation-request-interaction.entity';
import { PaymentAppService } from '../../../payment/payment.app-service';

import { DonateCommand } from './donate.command';

@Injectable()
@CommandHandler(DonateCommand)
export class DonateCommandHandler implements ICommandHandler<DonateCommand> {
  constructor(
    @InjectRepository(DonationRequestEntity)
    private donationReqRepo: EntityRepository<DonationRequestEntity>,
    @InjectRepository(DonationRequestInteractionEntity)
    private donationReqInteractionRepo: EntityRepository<DonationRequestInteractionEntity>,
    private em: EntityManager,

    private paymentService: PaymentAppService,
    private log: LoggerService,
    private eventBus: EventBusService,
  ) {}

  async execute(command: DonateCommand): Promise<string> {
    this.log.info({ command }, 'Executing DonateCommand');
    const {
      donationRequestId,
      chargeProvider,
      chargeToken,
      note,
      amountInCents,
    } = command;

    const request = await this.donationReqRepo.findOneOrFail(
      donationRequestId,
      { populate: ['nonprofit'] },
    );

    if (amountInCents < request.amountInCents) {
      throw new BadRequestException('Insufficient donation amount');
    }

    try {
      const paymentId = await this.paymentService.charge({
        chargeToken,
        amountCents: amountInCents,
        provider: chargeProvider,
        initiator: PaymentInitiator.USER_DONATION_REQUEST,
        initiatorId: donationRequestId,
      });

      if (request.type === DonationRequestType.SingleUse) {
        request.isActive = false;
      }
      const interaction = new DonationRequestInteractionEntity({
        interaction: DonationRequestInteraction.Donated,
        paymentId,
        amountInCents,
        request,
        note: note ?? '',
      });

      this.donationReqRepo.persist(request);
      this.donationReqInteractionRepo.persist(interaction);
      await this.em.flush();

      await this.eventBus.publish(
        new DonationRequestReceivedEvent(interaction),
      );
      return interaction.donationRequestInteractionId;
    } catch (error) {
      this.log.error({ error }, 'DonateCommand failed');
      throw error;
    }
  }
}
