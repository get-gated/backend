import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ExpectedConsent } from '@app/interfaces/challenge/challenge.enums';

export class MarkExpectedConsentRequestDto {
  @IsUUID()
  @IsNotEmpty()
  consentId!: string;

  @IsNotEmpty()
  @IsEnum(ExpectedConsent)
  consentResponse!: ExpectedConsent;
}
