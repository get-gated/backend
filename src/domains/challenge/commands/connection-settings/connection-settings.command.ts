import { ChallengeMode } from '@app/interfaces/challenge/challenge.enums';

export class ConnectionSettingsCommand {
  constructor(
    public readonly connectionId: string,
    public readonly userId: string,
    public readonly mode: ChallengeMode,
    public readonly templateId?: string,
    public readonly greetingBlock?: string,
    public readonly leadBlock?: string,
    public readonly donateBlock?: string,
    public readonly expectedBlock?: string,
    public readonly signatureBlock?: string,
  ) {}
}
