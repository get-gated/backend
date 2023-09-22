import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { IGraphqlContext } from '@app/modules/graphql';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { Maybe } from '@app/modules/utils';

import TrainingEntity from '../../entities/training.entity';
import PatternRepository from '../../entities/repositories/pattern.repository';

@Resolver(() => TrainingEntity)
export class TrainingByEmailInheritedRuleFieldGraphqlResolver {
  constructor(private patternRepo: PatternRepository) {}

  @ResolveField(() => Rule, { nullable: true })
  async inheritedRule(
    @Parent() parent: TrainingEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<Maybe<Rule>> {
    const pattern = await this.patternRepo.emailMatch(
      `${parent.username || ''}@${parent.domain}`,
    );

    let domainTraining: TrainingEntity | undefined;
    if (parent.username) {
      domainTraining = await loaders.trainingByEmail.load({
        username: null,
        domain: parent.domain,
        userId: parent.userId,
      });
    }

    return domainTraining?.rule || pattern?.rule || null;
  }
}
