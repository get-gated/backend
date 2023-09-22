import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

@InputType('ChallengeTemplateToggleInput')
@ArgsType()
export class ToggleChallengeTemplateRequest {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  challengeTemplateId!: string;

  @IsBoolean()
  @Field(() => Boolean)
  isEnabled!: boolean;
}
