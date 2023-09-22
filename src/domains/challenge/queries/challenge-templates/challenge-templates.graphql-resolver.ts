import { Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';

import { ChallengeTemplatesQuery } from './challenge-templates.query';
import { ChallengeTemplatesResponse } from './challenge-templates.response.dto';

@Resolver()
export class ChallengeTemplatesGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => ChallengeTemplatesResponse)
  @Allow(SpecialRole.AllAuthenticated)
  async challengeTemplates(): Promise<ChallengeTemplatesResponse> {
    const challengeTemplates = await this.queryBus.execute(
      new ChallengeTemplatesQuery(),
    );
    return {
      challengeTemplates,
    };
  }
}
