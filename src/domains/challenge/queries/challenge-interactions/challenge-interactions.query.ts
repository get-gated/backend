import { QueryOrder } from '@mikro-orm/core';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

export class ChallengeInteractionsQuery {
  constructor(
    public readonly userId: string,
    public readonly since: Date,
    public readonly order: QueryOrder,
    public readonly limit: number = 50,
    public readonly interaction: ChallengeInteraction,
    public readonly challengeId?: string,
  ) {}
}
