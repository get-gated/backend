import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from '@app/modules/logger';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { PaymentInitiator } from '@app/interfaces/payment/payment.enums';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

import ChallengeUserSettingEntity from '../../entities/user-setting.entity';
import { ChallengeService } from '../../services/challenge.service';
import { PaymentAppService } from '../../../payment/payment.app-service';
import ChallengeEntity from '../../entities/challenge.entity';

import { SenderDonateCommand } from './sender-donate.command';

@Injectable()
@CommandHandler(SenderDonateCommand)
export class SenderDonateCommandHandler
  implements ICommandHandler<SenderDonateCommand>
{
  constructor(
    private paymentService: PaymentAppService,
    private log: LoggerService,
    @InjectRepository(ChallengeUserSettingEntity)
    private userSettingsRepo: EntityRepository<ChallengeUserSettingEntity>,
    @InjectRepository(ChallengeEntity)
    private challengeRepo: EntityRepository<ChallengeEntity>,
    private challengeService: ChallengeService,
  ) {}

  async execute(command: SenderDonateCommand): Promise<void> {
    this.log.info({ command }, 'Executing SenderDonate Command');
    const {
      paymentToken,
      chargeProvider,
      chargeToken,
      personalizedNote,
      amountInCents,
    } = command;

    let challengeId: string;
    try {
      const { initiatorId } = await this.paymentService.fromPaymentToken(
        paymentToken,
      );
      challengeId = initiatorId;
    } catch (error) {
      this.log.error(
        { error, paymentToken },
        'Error decoding payment token. Unable to capture donation.',
      );
      throw new BadRequestException('Invalid payment token');
    }
    const challenge = await this.challengeRepo.findOneOrFail(challengeId);

    // make sure this is a valid donation
    const userSettings = await this.userSettingsRepo.findOneOrFail({
      userId: challenge.userId,
    });

    if (userSettings.minimumDonation > amountInCents) {
      throw new BadRequestException('Insufficient donation');
    }

    try {
      const paymentId = await this.paymentService.charge({
        chargeToken,
        amountCents: amountInCents,
        provider: chargeProvider,
        initiator: PaymentInitiator.CHALLENGE_INTERACTION,
        initiatorId: challengeId,
      });

      await this.challengeService.recordInteraction(
        challengeId,
        ChallengeInteraction.Donated,
        paymentId,
        undefined,
        amountInCents,
        undefined,
        personalizedNote,
      );
    } catch (error) {
      this.log.error({ error }, 'SenderDonate failed');
      throw error;
    }
  }
}
