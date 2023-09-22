import { Body, Controller, Post } from '@nestjs/common';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import { ChallengeTemplatePreviewRequest } from './challenge-template-preview.request.dto';
import { ChallengeTemplatePreviewQuery } from './challenge-template-preview.query';

@Controller()
export class ChallengeTemplatePreviewHttpController {
  constructor(private queryBus: QueryBus) {}

  static route = '/challenge/template/preview';

  @Post(ChallengeTemplatePreviewHttpController.route)
  @Allow(Role.Admin)
  public async(
    @Body() input: ChallengeTemplatePreviewRequest,
    @User() { userId }: AuthedUser,
  ): Promise<any> {
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
