import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import UserTaskEntity from '../../entities/task.entity';

import { TaskQuery } from './task.query';

export type IUserTaskDataLoader = DataLoader<string, UserTaskEntity>;

export function userTaskDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, UserTaskEntity> {
  return new DataLoader<string, UserTaskEntity>(
    async (ids: readonly string[]) => {
      const data: UserTaskEntity[] = await queryBus.execute(
        new TaskQuery([...ids]),
      );

      const map = mapFromArray(data, (item) => item.taskId);

      return ids.map((id) => map[id]);
    },
  );
}
