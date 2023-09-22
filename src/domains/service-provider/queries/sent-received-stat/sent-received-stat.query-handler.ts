import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { UtilsService } from '@app/modules/utils';

import { SentReceivedEntity } from '../../entities/sent-received.entity';
import SentReceivedStatEntity from '../../entities/sent-received-stat.entity';

import { SentReceivedStatQuery } from './sent-received-stat.query';

@QueryHandler(SentReceivedStatQuery)
export class SentReceivedStatQueryHandler
  implements IQueryHandler<SentReceivedStatQuery>
{
  constructor(private em: EntityManager, private utils: UtilsService) {}

  async execute(query: SentReceivedStatQuery): Promise<SentReceivedStatEntity> {
    const { userId, sender } = query;

    const isDomain = sender[0] === '@' || !sender.includes('@');

    let domain;
    let username: string | undefined;

    if (isDomain) {
      domain = sender.toLowerCase().replace('@', '');
    } else {
      const email = this.utils.normalizeEmail(sender);
      domain = email.domain;
      username = email.username;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const where: any = { user_id: userId, domain };

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

    if (!isDomain) {
      where.username = username;
      groupBy.push('username');
      select.push('username');
    }

    const results = await knex
      .select(select)
      .from(tableName)
      .where(where)
      .groupBy(groupBy)
      .limit(1);

    if (results.length !== 1) {
      return new SentReceivedStatEntity({
        domain,
        username,
        receivedCount: 0,
        sentCount: 0,
        lastSeenAt: undefined,
        firstSeenAt: undefined,
      });
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new SentReceivedStatEntity(results[0]);
  }
}
