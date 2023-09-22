import { ExpectedReason } from '@app/interfaces/challenge/challenge.enums';

export class MarkExpectedCommand {
  constructor(
    public readonly challengeId: string,
    public readonly expectedReason?: ExpectedReason,
    public readonly expectedReasonDescription?: string,
    public readonly personalizedNote?: string,
  ) {}
}
