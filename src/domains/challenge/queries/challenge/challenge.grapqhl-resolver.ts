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

import ChallengeEntity from '../../entities/challenge.entity';
import NonprofitEntity from '../../entities/nonprofit.entity';

import { ChallengeRequest } from './challenge.request.dto';

@Resolver(() => ChallengeEntity)
export class ChallengeGrapqhlResolver {
  @Query(() => ChallengeEntity)
  @Allow(Role.User)
  async challenge(
    @Args('id', { type: () => ID }) { challengeId }: ChallengeRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ChallengeEntity> {
    return loaders.challenge.load(challengeId);
  }

  @ResolveField(() => NonprofitEntity)
  async nonprofit(
    @Parent() parent: ChallengeEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<NonprofitEntity> {
    return loaders.nonprofit.load(parent.nonprofitId);
  }
}
