import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import UserSettingsEntity from '../../entities/user-settings.entity';
import { UserAppService } from '../../../user/user.app-service';
import { PaymentAppService } from '../../../payment/payment.app-service';
import ChallengeAppService from '../../../challenge/challenge.app-service';

export interface TxTemplateVariables {
  userFirstName: string;
  userLastName: string;
  userFullName: string;
  userEmailAddress: string;
  userReferralCode?: string | null;
  userHandle?: string;
  userAvatar?: string;
  nonprofitName?: string;
  nonprofitSlug?: string;
  paymentAmount?: number;
  senderEmailAddress?: string;
  connectionProvider?: string;
  connectionEmail?: string;
  reasonText?: string;
  experienceText?: string;
  senderPersonalizedNote?: string;
  challengeExpectedConsentId?: string;
}

@Injectable()
export class TxEmailService {
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingRepo: EntityRepository<UserSettingsEntity>,
    private userService: UserAppService,
    private paymentService: PaymentAppService,
    private challengeService: ChallengeAppService,
  ) {}

  public async getVariables(
    ids: {
      userId: string;
      paymentId?: string;
    },
    getNonprofit = false,
  ): Promise<
    Pick<
      TxTemplateVariables,
      | 'userFirstName'
      | 'userLastName'
      | 'userFullName'
      | 'userAvatar'
      | 'userEmailAddress'
      | 'userReferralCode'
      | 'userHandle'
      | 'paymentAmount'
      | 'nonprofitName'
      | 'nonprofitSlug'
    >
  > {
    const { userId, paymentId } = ids;

    const settings = await this.userSettingRepo.findOneOrFail({ userId });

    const { avatar, firstName, lastName, fullName, referralCode, handle } =
      await this.userService.queryGetUser(userId);

    let paymentAmount;
    if (paymentId) {
      const payment = await this.paymentService.queryPayment(paymentId);
      paymentAmount = payment.amountCents;
    }

    let nonprofitName;
    let nonprofitSlug;
    if (getNonprofit) {
      const challengeSettings =
        await this.challengeService.queryChallengeUserSettings({
          userId,
        });
      nonprofitName = challengeSettings.nonprofit.name;
      nonprofitSlug = challengeSettings.nonprofit.slug;
    }

    return {
      userFirstName: firstName,
      userLastName: lastName,
      userFullName: fullName,
      userHandle: handle,
      userAvatar: avatar,
      userEmailAddress: settings.email,
      userReferralCode: referralCode,
      paymentAmount,
      nonprofitSlug,
      nonprofitName,
    };
  }
}
