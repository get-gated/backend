import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import ChallengeTemplateEntity from '../../entities/template.entity';

import { ChallengeTemplateQuery } from './challenge-template.query';

export type IChallengeTemplateDataLoader = DataLoader<
  string,
  ChallengeTemplateEntity
>;

export function challengeTemplateDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, ChallengeTemplateEntity> {
  return new DataLoader<string, ChallengeTemplateEntity>(
    async (ids: string[]) => {
      const results: ChallengeTemplateEntity[] = await queryBus.execute(
        new ChallengeTemplateQuery([...ids]),
      );

      const map = mapFromArray(results, (item) => item.challengeTemplateId);

      return ids.map((id) => map[id]);
    },
  );
}
