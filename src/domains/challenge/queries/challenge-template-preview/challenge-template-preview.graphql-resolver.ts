import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import { ChallengeTemplatePreviewRequest } from './challenge-template-preview.request.dto';
import { ChallengeTemplatePreviewQuery } from './challenge-template-preview.query';

@Resolver()
export class ChallengeTemplatePreviewGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => String)
  @Allow(Role.Admin)
  public async challengeTemplatePreview(
    @Args('input') input: ChallengeTemplatePreviewRequest,
    @User() { userId }: AuthedUser,
  ): Promise<string> {
    return this.queryBus.execute(
      new ChallengeTemplatePreviewQuery(
        userId,
        input.connectionId,
        input.templateId,
        input.greetingBlock,
        input.leadBlock,
        input.donateBlock,
        input.expectedBlock,
        input.signatureBlock,
      ),
    );
  }
}
