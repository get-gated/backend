import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import ConnectionLogEntity from '../../entities/connection-log.entity';

import { ConnectionLogQuery } from './connection-log.query';

export type IConnectionLogDataLoader = DataLoader<string, ConnectionLogEntity>;

export function connectionLogDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, ConnectionLogEntity> {
  return new DataLoader<string, ConnectionLogEntity>(
    async (connectionLogIds: readonly string[]) => {
      const connectionLogs: ConnectionLogEntity[] = await queryBus.execute(
        new ConnectionLogQuery([...connectionLogIds]),
      );

      const map = mapFromArray(connectionLogs, (log) => log.connectionLogId);

      return connectionLogIds.map((id) => map[id]);
    },
  );
}
