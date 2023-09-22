import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import DecisionEntity from '../../entities/decision.entity';

import { DecisionQuery } from './decision.query';

export type IDecisionDataLoader = DataLoader<string, DecisionEntity>;

export function decisionDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, DecisionEntity> {
  return new DataLoader<string, DecisionEntity>(async (ids: string[]) => {
    const results: DecisionEntity[] = await queryBus.execute(
      new DecisionQuery([...ids]),
    );

    const map = mapFromArray(results, (item) => item.decisionId);

    return ids.map((id) => map[id]);
  });
}
