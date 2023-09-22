import { DonationRequestInterface } from '@app/interfaces/challenge/donation-request.interface';
import { DonationRequestType } from '@app/interfaces/challenge/challenge.enums';

export class RequestDonationCommand
  implements
    Omit<
      DonationRequestInterface,
      'donationRequestId' | 'createdAt' | 'nonprofit' | 'isActive'
    >
{
  constructor(
    public readonly userId: string,
    public readonly type: DonationRequestType,
    public readonly amountInCents: number,
    public readonly memo: string,
    public readonly allowExemptionRequest: boolean,
    public readonly isFeatured?: boolean,
    public readonly cta?: string,
    public readonly thankYouMessage?: string,
    public readonly nonprofitId?: string,
    public readonly name?: string,
    public readonly donationRequestId?: string,
  ) {}
}
