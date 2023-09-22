import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsBase64, IsOptional, IsString } from 'class-validator';
import { ExpectedReason } from '@app/interfaces/challenge/challenge.enums';

@InputType('ChallengeMarkExpectedInput')
@ArgsType()
export class MarkExpectedRequest {
  @IsBase64()
  @Field()
  token!: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  personalizedNote?: string;

  @Field(() => ExpectedReason, { nullable: true })
  expectedReason?: ExpectedReason;

  @Field({ nullable: true })
  expectedReasonDescription?: string;
}
