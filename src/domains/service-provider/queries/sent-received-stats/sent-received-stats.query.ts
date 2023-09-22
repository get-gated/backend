import { QueryOrder } from '@mikro-orm/core';

import {
  SentReceivedStatSortBy,
  SentReceivedStatType,
} from './sent-received-stats.enums';

export class SentReceivedStatsQuery {
  constructor(
    public readonly userId: string,
    public readonly sortBy: SentReceivedStatSortBy,
    public readonly order: QueryOrder,
    public readonly limit: number = 50,
    public readonly offset: number,
    public readonly type: SentReceivedStatType,
    public readonly query?: string,
    public readonly receivedCountGreaterThan?: number,
    public readonly receivedCountLessThan?: number,
    public readonly sentCountGreaterThan?: number,
    public readonly sentCountLessThan?: number,
    public readonly firstSeenAtSince?: Date,
    public readonly firstSeenAtBefore?: Date,
    public readonly lastSeenAtSince?: Date,
    public readonly lastSeenAtBefore?: Date,
    public readonly forDomain?: string,
  ) {}
}
