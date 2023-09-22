import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('NotificationAddPushTokenInput')
export class AddPushTokenRequestDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  token!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  device!: string;
}
