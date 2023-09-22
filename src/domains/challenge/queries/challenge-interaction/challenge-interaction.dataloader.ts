import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';

import { ChallengeInteractionQuery } from './challenge-interaction.query';

export type IChallengeInteractionDataLoader = DataLoader<
  string,
  ChallengeInteractionEntity
>;

export function challengeInteractionDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, ChallengeInteractionEntity> {
  return new DataLoader<string, ChallengeInteractionEntity>(
    async (challengeInteractionIds: string[]) => {
      const interactions: ChallengeInteractionEntity[] = await queryBus.execute(
        new ChallengeInteractionQuery([...challengeInteractionIds]),
      );

      const interactionMap = mapFromArray(
        interactions,
        (interaction) => interaction.challengeInteractionId,
      );

      return challengeInteractionIds.map((id) => interactionMap[id]);
    },
  );
}
