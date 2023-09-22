import { Field, ObjectType } from '@nestjs/graphql';

import ChallengeTemplateEntity from '../../entities/template.entity';

@ObjectType()
export class ChallengeTemplatesResponse {
  @Field(() => [ChallengeTemplateEntity])
  challengeTemplates!: ChallengeTemplateEntity[];
}
