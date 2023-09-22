import { FilterQuery, Repository, wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import HistoryThreadEntity, {
  IHistoryThreadEntityConstructor,
} from '../history-thread.entity';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Repository(HistoryThreadEntity)
export default class HistoryThreadRepository extends EntityRepository<HistoryThreadEntity> {
  public async upsert(
    where: FilterQuery<HistoryThreadEntity>,
    data: IHistoryThreadEntityConstructor,
  ): Promise<HistoryThreadEntity> {
    let entity = await this.findOne(where);

    if (entity) {
      wrap(entity).assign(data);
    } else {
      entity = new HistoryThreadEntity(data);
    }

    this.persist(entity);
    return entity;
  }
}
