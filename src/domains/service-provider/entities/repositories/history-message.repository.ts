import { FilterQuery, Repository, wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import HistoryMessageEntity, {
  IHistoryMessageEntityConstructor,
} from '../history-message.entity';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Repository(HistoryMessageEntity)
export default class HistoryMessageRepository extends EntityRepository<HistoryMessageEntity> {
  public async upsert(
    where: FilterQuery<HistoryMessageEntity>,
    data: IHistoryMessageEntityConstructor,
  ): Promise<HistoryMessageEntity> {
    let entity = await this.findOne(where);

    if (entity) {
      wrap(entity).assign({ ...data, wasSentBySystem: entity.wasSentBySystem });
    } else {
      entity = new HistoryMessageEntity(data);
    }

    this.persist(entity);
    return entity;
  }

  /**
   * Whether or not the specified user has sent a message to the given email address.
   * This includes to:, cc:, bcc:
   */
  public async hasSentTo(
    userId: string,
    toEmailAddress: string,
  ): Promise<boolean> {
    const emailValue = `[{"emailAddress": "${toEmailAddress}"}]`;
    const knex = this.getKnex();
    const result = await knex.raw(
      `
      select count(*)
        from service_provider_messages s
       where user_id = ?
         and type = 'sent'
         and was_sent_by_system = false
         and (
            s.to @> ?
            or 
            s.cc @> ?
            or
            s.bcc @> ?
         )
      `,
      [userId, emailValue, emailValue, emailValue],
    );

    return parseInt(result.rows?.[0]?.count ?? '0', 10) > 0;
  }
}
