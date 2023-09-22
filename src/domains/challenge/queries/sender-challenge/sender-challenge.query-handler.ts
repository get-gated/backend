import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

import ChallengeUserSettingEntity from '../../entities/user-setting.entity';
import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';
import ChallengeEntity from '../../entities/challenge.entity';
import NonprofitEntity from '../../entities/nonprofit.entity';

import { SenderChallengeQuery } from './sender-challenge.query';

export interface ISenderChallengeQueryHandlerResponse {
  challenge: ChallengeEntity;
  userSettings: ChallengeUserSettingEntity;
  nonprofit: NonprofitEntity;
  hasDonation: boolean;
  hasExpected: boolean;
  donationAmountInCents?: number;
}

@QueryHandler(SenderChallengeQuery)
export class SenderChallengeQueryHandler
  implements IQueryHandler<SenderChallengeQuery>
{
  constructor(
    @InjectRepository(ChallengeEntity)
    private challengeRepo: EntityRepository<ChallengeEntity>,
    @InjectRepository(ChallengeUserSettingEntity)
    private userSettingsRepo: EntityRepository<ChallengeUserSettingEntity>,
    @InjectRepository(ChallengeInteractionEntity)
    private interactionRepo: EntityRepository<ChallengeInteractionEntity>,
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  async execute({
    challengeId,
  }: SenderChallengeQuery): Promise<ISenderChallengeQueryHandlerResponse> {
    const challenge = await this.challengeRepo.findOneOrFail({
      challengeId,
    });
    const userSettings = await this.userSettingsRepo.findOneOrFail({
      userId: challenge.userId,
    });

    let { nonprofit } = userSettings;

    if (!nonprofit) {
      nonprofit = await this.nonprofitRepo.findOneOrFail({ isDefault: true });
    }

    const donationInteraction = await this.interactionRepo.findOne({
      challenge,
      interaction: ChallengeInteraction.Donated,
    });

    const hasExpected = Boolean(
      await this.interactionRepo.findOne({
        challenge,
        interaction: ChallengeInteraction.Expected,
      }),
    );

    return {
      challenge,
      userSettings,
      hasDonation: Boolean(donationInteraction),
      hasExpected,
      nonprofit,
      donationAmountInCents: donationInteraction?.paymentAmount,
    };
  }
}
