import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { IGraphqlContext } from '@app/modules/graphql';
import { AuthedUser, User } from '@app/modules/auth';

import TrainingEntity from '../../entities/training.entity';
import SentReceivedStatEntity from '../../../service-provider/entities/sent-received-stat.entity';

@Resolver(() => SentReceivedStatEntity)
export class TrainingByEmailSentReceivedStatGraphqlResolver {
  @ResolveField(() => TrainingEntity)
  async training(
    @Parent() stat: SentReceivedStatEntity,
    @Context() { loaders }: IGraphqlContext,
    @User() user: AuthedUser,
  ): Promise<TrainingEntity> {
    return loaders.trainingByEmail.load({
      username: stat.username || null,
      domain: stat.domain,
      userId: user.userId,
    });
  }
}
