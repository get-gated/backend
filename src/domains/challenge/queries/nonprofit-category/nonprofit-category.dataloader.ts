import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';

import { NonprofitCategoryQuery } from './nonprofit-category.query';

export type INonprofitCategoryDataLoader = DataLoader<
  string,
  NonprofitCategoryEntity
>;

export function nonprofitCategoryDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, NonprofitCategoryEntity> {
  return new DataLoader<string, NonprofitCategoryEntity>(
    async (ids: string[]) => {
      const results: NonprofitCategoryEntity[] = await queryBus.execute(
        new NonprofitCategoryQuery([...ids]),
      );

      const map = mapFromArray(results, (item) => item.nonprofitCategoryId);

      return ids.map((id) => map[id]);
    },
  );
}
