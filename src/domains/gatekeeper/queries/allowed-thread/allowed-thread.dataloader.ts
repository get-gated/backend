import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import { AllowedThreadEntity } from '../../entities/allowed-thread.entity';

import { AllowedThreadQuery } from './allowed-thread.query';

export type IAllowedThreadDataLoader = DataLoader<string, AllowedThreadEntity>;

export function allowedThreadDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, AllowedThreadEntity> {
  return new DataLoader<string, AllowedThreadEntity>(async (ids: string[]) => {
    const results: AllowedThreadEntity[] = await queryBus.execute(
      new AllowedThreadQuery([...ids]),
    );

    const map = mapFromArray(results, (item) => item.allowedThreadId);

    return ids.map((id) => map[id]);
  });
}
