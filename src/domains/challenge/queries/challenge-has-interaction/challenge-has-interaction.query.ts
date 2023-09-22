import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

export class ChallengeHasInteractionQuery {
  constructor(
    public readonly challengeId: string,
    public readonly interaction: ChallengeInteraction,
  ) {}
}
