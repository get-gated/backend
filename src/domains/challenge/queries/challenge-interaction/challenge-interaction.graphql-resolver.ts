import {
  Args,
  Context,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { IGraphqlContext } from '@app/modules/graphql';
import { Allow, Role } from '@app/modules/auth';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';
import ChallengeEntity from '../../entities/challenge.entity';

import { ChallengeInteractionRequest } from './challenge-interaction.request.dto';

@Resolver(() => ChallengeInteractionEntity)
export class ChallengeInteractionGraphqlResolver {
  @Query(() => ChallengeInteractionEntity)
  @Allow(Role.User)
  async challengeInteraction(
    @Args('id', { type: () => ID })
    { challengeInteractionId }: ChallengeInteractionRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ChallengeInteractionEntity> {
    return loaders.challengeInteraction.load(challengeInteractionId);
  }

  @ResolveField(() => ChallengeEntity)
  async challenge(
    @Parent() { challenge }: ChallengeInteractionEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ChallengeEntity> {
    return loaders.challenge.load(challenge.challengeId);
  }
}
