import { DonationRequestType } from '@app/interfaces/challenge/challenge.enums';

import DonationRequestEntity from '../../entities/donation-request.entity';

export class DonationRequestResponseDto
  implements
    Pick<
      DonationRequestEntity,
      | 'amountInCents'
      | 'allowExemptionRequest'
      | 'memo'
      | 'thankYouMessage'
      | 'createdAt'
      | 'donationRequestId'
      | 'type'
    >
{
  amountInCents!: number;

  allowExemptionRequest!: boolean;

  nonprofitName!: string;

  isCompleted!: boolean;

  completedAt?: Date;

  thankYouMessage!: string;

  memo!: string;

  createdAt!: Date;

  donationRequestId!: string;

  type!: DonationRequestType;

  userId!: string;
}
