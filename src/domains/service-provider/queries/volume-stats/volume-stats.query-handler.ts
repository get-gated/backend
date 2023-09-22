import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';

import HistoryMessageEntity from '../../entities/history-message.entity';
import { VolumeStatEntity } from '../../entities/volume-stat.entity';

import { VolumeStatsQuery } from './volume-stats.query';

@QueryHandler(VolumeStatsQuery)
export class VolumeStatsQueryHandler
  implements IQueryHandler<VolumeStatsQuery>
{
  constructor(private em: EntityManager) {}

  async execute(query: VolumeStatsQuery): Promise<VolumeStatEntity> {
    const { userId, startAt, endAt } = query;

    const knex = this.em.getKnex();
    const { tableName } = this.em.getMetadata().get(HistoryMessageEntity.name);

    const [{ count: receivedMessages }] = await knex
      .from(tableName)
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .where({ user_id: userId, type: MessageType.Received })
      .andWhere('received_at', '>', startAt)
      .andWhere('received_at', '<', endAt)
      .count();

    return new VolumeStatEntity({
      startAt,
      endAt,
      receivedMessages: Number(receivedMessages),
    });
  }
}
