import { Repository, wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import ConnectionEntity, {
  IConnectionEntityConstructor,
} from '../connection.entity';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Repository(ConnectionEntity)
export default class ConnectionRepository extends EntityRepository<ConnectionEntity> {
  public async getUserIdByEmailAddress(
    emailAddress: string,
  ): Promise<string | null> {
    const result = await this.findOne(
      { emailAddress },
      {
        fields: ['userId'],
      },
    );

    if (!result) {
      return null;
    }

    return result.userId;
  }

  public async upsertConnection(
    data: IConnectionEntityConstructor,
  ): Promise<ConnectionEntity> {
    let entity = await this.findOne({
      userId: data.userId,
      externalAccountId: data.externalAccountId,
    });

    if (entity) {
      wrap(entity).assign(data);
    } else {
      entity = new ConnectionEntity(data);
    }

    this.persist(entity);
    return entity;
  }
}
