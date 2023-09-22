import { ExpectedConsent } from '@app/interfaces/challenge/challenge.enums';

export class MarkExpectedConsentCommand {
  constructor(
    public readonly consentId: string,
    public readonly consentResponse: ExpectedConsent,
  ) {}
}
