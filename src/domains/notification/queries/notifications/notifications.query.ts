import { QueryOrder } from '@mikro-orm/core';

export class NotificationsQuery {
  constructor(
    public readonly userId: string,
    public readonly since: Date,
    public readonly order: QueryOrder,
    public readonly limit: number = 50,
  ) {}
}
