import { QueryOrder } from '@mikro-orm/core';

export class ConnectionLogsQuery {
  constructor(
    public readonly connectionId: string,
    public readonly since: Date,
    public readonly order: QueryOrder,
    public readonly limit: number = 50,
  ) {}
}
