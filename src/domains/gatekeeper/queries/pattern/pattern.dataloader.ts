import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import PatternEntity from '../../entities/pattern.entity';

import { PatternQuery } from './pattern.query';

export type IPatternDataLoader = DataLoader<string, PatternEntity>;

export function patternDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, PatternEntity> {
  return new DataLoader<string, PatternEntity>(async (ids: string[]) => {
    const results: PatternEntity[] = await queryBus.execute(
      new PatternQuery([...ids]),
    );

    const map = mapFromArray(results, (item) => item.patternId);

    return ids.map((id) => map[id]);
  });
}
