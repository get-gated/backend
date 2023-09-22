import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType('OptOutAddressAddInput')
export class AddOptOutAddressRequestDto {
  @Field()
  @IsEmail()
  emailAddress!: string;
}
