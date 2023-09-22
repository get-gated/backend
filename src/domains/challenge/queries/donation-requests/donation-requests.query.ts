import { QueryOrder } from '@mikro-orm/core';
import { DonationRequestType } from '@app/interfaces/challenge/challenge.enums';

export class DonationRequestsQuery {
  constructor(
    public readonly userId: string,
    public readonly since: Date,
    public readonly order: QueryOrder,
    public readonly limit: number,
    public readonly type: DonationRequestType,
    public readonly isActive?: boolean,
  ) {}
}
