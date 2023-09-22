export class SenderChallengeResponseDto {
  challengeId!: string;

  nonprofitName!: string;

  nonprofitLogo?: string;

  minimumDonationInCents!: number;

  firstName!: string;

  lastName!: string;

  fullName!: string;

  avatar?: string;

  hasDonation!: boolean; // challenge previously has donation interation

  hasExpected!: boolean; // challenge previously has expected interaction

  isActive!: boolean; // the account is active and we can perform sender's action

  nonprofitReason?: string;

  senderEmail!: string;

  referralCode?: string | null;

  donationAmountInCents?: number;
}
