import { QueryOrder } from '@mikro-orm/core';

export class DonationsQuery {
  constructor(
    public readonly userId: string,
    public readonly since: Date,
    public readonly order: QueryOrder,
    public readonly limit: number,
    public readonly donationRequestId?: string,
  ) {}
}
