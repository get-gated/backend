import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import ChallengeEntity from '../../entities/challenge.entity';

import { ChallengeQuery } from './challenge.query';

export type IChallengeDataLoader = DataLoader<string, ChallengeEntity>;

export function challengeDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, ChallengeEntity> {
  return new DataLoader<string, ChallengeEntity>(
    async (challengeIds: string[]) => {
      const challenges: ChallengeEntity[] = await queryBus.execute(
        new ChallengeQuery([...challengeIds]),
      );

      const challengeMap = mapFromArray(
        challenges,
        (challenge) => challenge.challengeId,
      );

      return challengeIds.map((id) => challengeMap[id]);
    },
  );
}
