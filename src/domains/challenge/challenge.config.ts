import { envOrFail } from '@app/modules/utils';
import { registerAs } from '@nestjs/config';

interface ChallengeConfig {
  expectedUrl: string;
  donationUrl: string;
  challengeTokenUrlVariable: string; // the string in the above urls that should be swapped with the challenge token
  defaultMinimumDonationAmount: number;
  nonprofitLogoBucket: string;
  challengeLimitPerSenderInHours: number;
}

export default registerAs(
  'challenge',
  (): ChallengeConfig => ({
    expectedUrl: envOrFail('CHALLENGE_EXPECTED_URL'),
    donationUrl: envOrFail('CHALLENGE_DONATION_URL'),
    challengeTokenUrlVariable: envOrFail('CHALLENGE_TOKEN_URL_VARIABLE'),
    defaultMinimumDonationAmount: Number(
      envOrFail('CHALLENGE_DEFAULT_MIN_DONATION_AMOUNT'),
    ),
    nonprofitLogoBucket: envOrFail('NONPROFIT_LOGO_BUCKET'),
    challengeLimitPerSenderInHours: Number(
      envOrFail('CHALLENGE_LIMIT_PER_SENDER_IN_HOURS'),
    ),
  }),
);
