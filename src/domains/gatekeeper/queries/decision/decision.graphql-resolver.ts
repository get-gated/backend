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
import { Maybe } from '@app/modules/utils';

import DecisionEntity from '../../entities/decision.entity';
import { AllowedThreadEntity } from '../../entities/allowed-thread.entity';
import TrainingEntity from '../../entities/training.entity';
import PatternEntity from '../../entities/pattern.entity';

@Resolver(() => DecisionEntity)
export class DecisionGraphqlResolver {
  @Query(() => DecisionEntity)
  @Allow(Role.User)
  async decision(
    @Args('id', { type: () => ID }) decisionId: string,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<DecisionEntity> {
    return loaders.decision.load(decisionId);
  }

  @ResolveField(() => AllowedThreadEntity)
  async allowedThread(
    @Parent() { allowedThreadId }: DecisionEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<Maybe<AllowedThreadEntity>> {
    if (!allowedThreadId) return;
    return loaders.allowedThread.load(allowedThreadId);
  }

  @ResolveField(() => TrainingEntity)
  async enforcedTraining(
    @Parent() { enforcedTrainingId }: DecisionEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<Maybe<TrainingEntity>> {
    if (!enforcedTrainingId) return;
    return loaders.training.load(enforcedTrainingId);
  }

  @ResolveField(() => PatternEntity)
  async enforcedPattern(
    @Parent() { enforcedPatternId }: DecisionEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<Maybe<PatternEntity>> {
    if (!enforcedPatternId) return;
    return loaders.pattern.load(enforcedPatternId);
  }
}
