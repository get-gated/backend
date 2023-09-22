import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType('GatekeeperTestQueryInput')
export class EvaluateMessageRequestDto {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  address!: string;
}
