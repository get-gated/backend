import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';

import TrainingEntity from '../../entities/training.entity';

import { TrainingByEmailQuery } from './training-by-email.query';

@QueryHandler(TrainingByEmailQuery)
export class TrainingByEmailQueryHandler
  implements IQueryHandler<TrainingByEmailQuery>
{
  constructor(private em: EntityManager) {}

  async execute(query: TrainingByEmailQuery): Promise<TrainingEntity[]> {
    const knex = this.em.getKnex();
    const q = knex
      .with('rules', (qb) => {
        qb.select(
          'id',
          'user_id',
          'username',
          'domain',
          'origin',
          'rule',
          knex.raw(
            'row_number() over (partition by user_id, "username", "domain" order by created_at desc) as training_order',
          ),
        ).from(this.em.getMetadata().get(TrainingEntity.name).tableName);
        query.emails.forEach((email) => {
          qb.orWhere({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            user_id: email.userId,
            domain: email.domain,
            username: email.username,
          });
        });
      })
      .select('id', 'user_id', 'username', 'domain', 'origin', 'rule')
      .from('rules')
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .where({ training_order: 1 });

    const res = await q;

    return res.map((item) => this.em.map(TrainingEntity, item));
  }
}
