import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { AddChallengeTemplateRequest } from '../add-challenge-template/add-challenge-template.request.dto';

@InputType('ChallengeTemplateUpdateInput')
@ArgsType()
export class UpdateChallengeTemplateRequest extends AddChallengeTemplateRequest {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  challengeTemplateId!: string;
}
