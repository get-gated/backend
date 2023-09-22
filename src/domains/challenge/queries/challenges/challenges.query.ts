import { QueryOrder } from '@mikro-orm/core';

export class ChallengesQuery {
  constructor(
    public readonly userId: string,
    public readonly since: Date,
    public readonly order: QueryOrder,
    public readonly limit: number = 50,
    public readonly recipient?: string,
  ) {}
}
