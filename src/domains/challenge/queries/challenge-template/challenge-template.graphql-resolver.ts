import { Args, Context, ID, Query, Resolver } from '@nestjs/graphql';
import { IGraphqlContext } from '@app/modules/graphql';
import { Allow, SpecialRole } from '@app/modules/auth';
import { NotFoundException } from '@nestjs/common';

import ChallengeTemplateEntity from '../../entities/template.entity';

@Resolver()
export class ChallengeTemplateGraphqlResolver {
  @Query(() => ChallengeTemplateEntity)
  @Allow(SpecialRole.AllAuthenticated)
  async challengeTemplate(
    @Args('id', { type: () => ID })
    challengeTemplateId: string,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ChallengeTemplateEntity> {
    const result = await loaders.challengeTemplate.load(challengeTemplateId);
    if (!result) {
      throw new NotFoundException('Challenge template not found');
    }
    return result;
  }
}
