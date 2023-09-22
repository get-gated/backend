import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { graphqlUtils } from '@app/modules/graphql';

import TrainingEntity from '../../entities/training.entity';

@Resolver(() => TrainingEntity)
export class TrainingGraphqlResolver {
  @ResolveField('id')
  id(@Parent() training: TrainingEntity): string {
    return graphqlUtils.encodeCursor(
      `${training.username || ''}@${training.domain}`,
    );
  }

  @ResolveField('versionId')
  versionId(@Parent() training: TrainingEntity): string {
    return training.trainingId;
  }
}
