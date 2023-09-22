import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';

import TrainingEntity from '../../entities/training.entity';

import {
  ITrainingByEmailQuery,
  TrainingByEmailQuery,
} from './training-by-email.query';

export type ITrainingByEmailDataLoader = DataLoader<
  ITrainingByEmailQuery,
  TrainingEntity
>;

export function trainingByEmailDataloader(
  queryBus: QueryBus,
): DataLoader<ITrainingByEmailQuery, TrainingEntity> {
  return new DataLoader<ITrainingByEmailQuery, TrainingEntity>(
    async (emails: ITrainingByEmailQuery[]) => {
      const results: TrainingEntity[] = await queryBus.execute(
        new TrainingByEmailQuery([...emails]),
      );

      return emails.map((email) =>
        results.find(
          (entity) =>
            entity.username === email.username &&
            entity.domain === email.domain &&
            entity.userId === email.userId,
        ),
      );
    },
  );
}
