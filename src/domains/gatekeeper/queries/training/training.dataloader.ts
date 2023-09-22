import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import TrainingEntity from '../../entities/training.entity';

import { TrainingQuery } from './training.query';

export type ITrainingDataLoader = DataLoader<string, TrainingEntity>;

export function trainingDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, TrainingEntity> {
  return new DataLoader<string, TrainingEntity>(async (ids: string[]) => {
    const results: TrainingEntity[] = await queryBus.execute(
      new TrainingQuery([...ids]),
    );

    const map = mapFromArray(results, (item) => item.trainingId);

    return ids.map((id) => map[id]);
  });
}
