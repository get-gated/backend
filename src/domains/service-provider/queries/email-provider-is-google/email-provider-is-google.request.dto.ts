import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class EmailProviderIsGoogleRequestDto {
  @Field()
  @IsEmail()
  emailAddress!: string;
}
