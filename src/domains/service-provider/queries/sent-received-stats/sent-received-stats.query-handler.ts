import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { QueryOrder } from '@mikro-orm/core';

import SentReceivedStatEntity from '../../entities/sent-received-stat.entity';
import { SentReceivedEntity } from '../../entities/sent-received.entity';

import { SentReceivedStatsQuery } from './sent-received-stats.query';
import { SentReceivedStatType } from './sent-received-stats.enums';

export interface TSentReceivedStatsQueryResponse {
  sentReceivedStats: SentReceivedStatEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(SentReceivedStatsQuery)
export class SentReceivedStatsQueryHandler
  implements IQueryHandler<SentReceivedStatsQuery>
{
  constructor(private em: EntityManager) {}

  async execute(
    query: SentReceivedStatsQuery,
  ): Promise<TSentReceivedStatsQueryResponse> {
    const { userId, type, order, limit, offset } = query;

    const knex = this.em.getKnex();
    const { tableName } = this.em.getMetadata().get(SentReceivedEntity.name);

    const receivedCount = `count(type='received' or null)`;
    const sentCount = `count(type='sent' or null)`;
    const firstSeenAt = `min(created_at)`;
    const lastSeenAt = `max(created_at)`;
    const groupBy = ['domain', 'user_id'];
    const select = [
      { userId: 'user_id' },
      'domain',
      knex.raw(`${receivedCount} as "receivedCount"`),
      knex.raw(`${sentCount} as "sentCount"`),
      knex.raw(`${firstSeenAt} as "firstSeenAt"`),
      knex.raw(`${lastSeenAt} as "lastSeenAt"`),
    ];

    if (type === SentReceivedStatType.Address) {
      groupBy.push('username');
      select.push('username');
    }

    const makeQuery = (): any => {
      const q = knex
        .select(select)
        .from(tableName)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .where({ user_id: userId })
        .groupBy(groupBy);

      if (query.receivedCountGreaterThan) {
        q.andHaving(
          knex.raw(receivedCount),
          '>',
          query.receivedCountGreaterThan,
        );
      }
      if (query.receivedCountLessThan) {
        q.andHaving(knex.raw(receivedCount), '<', query.receivedCountLessThan);
      }
      if (query.sentCountGreaterThan) {
        q.andHaving(knex.raw(sentCount), '>', query.sentCountGreaterThan);
      }
      if (query.sentCountLessThan) {
        q.andHaving(knex.raw(sentCount), '<', query.sentCountLessThan);
      }
      if (query.firstSeenAtSince) {
        q.andHaving(knex.raw(firstSeenAt), '>', query.firstSeenAtSince);
      }
      if (query.firstSeenAtBefore) {
        q.andHaving(knex.raw(firstSeenAt), '<', query.firstSeenAtBefore);
      }
      if (query.lastSeenAtSince) {
        q.andHaving(knex.raw(lastSeenAt), '>', query.lastSeenAtSince);
      }
      if (query.lastSeenAtBefore) {
        q.andHaving(knex.raw(lastSeenAt), '<', query.lastSeenAtBefore);
      }
      if (query.forDomain) {
        q.andHaving('domain', '=', query.forDomain);
      }

      if (query.query) {
        if (type === SentReceivedStatType.Address) {
          q.whereRaw(
            `(username LIKE '%${query.query}%' OR domain LIKE '%${query.query}%')`,
          );
        } else {
          q.whereRaw(`username LIKE '%${query.query}%'`);
        }
      }

      return q;
    };

    const runQuery = async (
      orderBy: string,
      orderDir: QueryOrder,
      queryLimit: number,
    ): Promise<SentReceivedStatEntity[]> => {
      const results = await makeQuery()
        .limit(queryLimit)
        .offset(offset)
        .orderBy(orderBy, orderDir.toLowerCase());
      return results.map((result: any) => new SentReceivedStatEntity(result));
    };

    const sentReceivedStats = await runQuery(query.sortBy, order, limit + 1);
    let hasNextPage;

    if (sentReceivedStats.length === limit + 1) {
      sentReceivedStats.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const hasPreviousPage = offset > 0 && sentReceivedStats.length > 0;

    const [results] = await knex.count().from(makeQuery().as('subquery'));

    return {
      sentReceivedStats,
      hasNextPage,
      hasPreviousPage,
      total: Number(results?.count || 0),
    };
  }
}
