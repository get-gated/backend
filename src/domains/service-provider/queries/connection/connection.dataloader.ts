import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import ConnectionEntity from '../../entities/connection.entity';

import { ConnectionQuery } from './connection.query';

export type IConnectionDataLoader = DataLoader<string, ConnectionEntity>;

export function connectionDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, ConnectionEntity> {
  return new DataLoader<string, ConnectionEntity>(
    async (connectionIds: readonly string[]) => {
      const connections: ConnectionEntity[] = await queryBus.execute(
        new ConnectionQuery([...connectionIds]),
      );

      const map = mapFromArray(
        connections,
        (connection) => connection.connectionId,
      );

      return connectionIds.map((id) => map[id]);
    },
  );
}
