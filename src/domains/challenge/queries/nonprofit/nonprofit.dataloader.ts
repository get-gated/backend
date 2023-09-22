import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import NonprofitEntity from '../../entities/nonprofit.entity';

import { NonprofitQuery } from './nonprofit.query';

export type INonprofitDataLoader = DataLoader<string, NonprofitEntity>;

export function nonprofitDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, NonprofitEntity> {
  return new DataLoader<string, NonprofitEntity>(async (ids: string[]) => {
    const results: NonprofitEntity[] = await queryBus.execute(
      new NonprofitQuery([...ids]),
    );

    const map = mapFromArray(results, (item) => item.nonprofitId);

    return ids.map((id) => map[id]);
  });
}
