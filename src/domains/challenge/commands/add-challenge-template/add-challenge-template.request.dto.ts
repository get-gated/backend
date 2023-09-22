import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Contains, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@InputType('ChallengeTemplateAddInput')
@ArgsType()
export class AddChallengeTemplateRequest {
  @IsString()
  @IsNotEmpty()
  @Field()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @Contains('%block_greeting%', {
    message: 'Greeting block merge variable required',
  })
  @Contains('%block_lead', { message: 'Lead block merge variable required' })
  @Contains('%block_donate%', {
    message: 'Donate block merge variable required',
  })
  @Contains('%block_expected%', {
    message: 'Expected block merge variable required',
  })
  @Contains('%block_signature%', {
    message: 'Signature block merge variable required',
  })
  body!: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  greetingBlock!: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  leadBlock!: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  donateBlock!: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  expectedBlock!: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  signatureBlock!: string;

  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  isEnabled? = true;
}
