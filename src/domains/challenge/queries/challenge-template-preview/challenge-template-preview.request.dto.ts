import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType('ChallengeTemplatePreviewInput')
@ArgsType()
export class ChallengeTemplatePreviewRequest {
  @Field()
  @IsUUID()
  connectionId!: string;

  @Field()
  @IsUUID()
  templateId!: string;

  @Field({ nullable: true })
  greetingBlock?: string;

  @Field({ nullable: true })
  leadBlock?: string;

  @Field({ nullable: true })
  donateBlock?: string;

  @Field({ nullable: true })
  expectedBlock?: string;

  @Field({ nullable: true })
  signatureBlock?: string;
}
