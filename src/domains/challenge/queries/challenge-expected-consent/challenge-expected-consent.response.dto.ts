import { ExpectedReason } from '@app/interfaces/challenge/challenge.enums';

export interface ChallengeExpectedConsentResponseDto {
  expectedEmailAddress: string;

  expectedInteractionAt: Date;

  expectedPersonalNote?: string;

  expectedReason?: ExpectedReason;

  consentGrantedAt?: Date;

  consentDeniedAt?: Date;
}
