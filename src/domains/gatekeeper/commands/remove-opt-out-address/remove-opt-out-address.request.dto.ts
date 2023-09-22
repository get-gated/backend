import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType('OptOutAddressRemoveInput')
export class RemoveOptOutAddressRequestDto {
  @Field()
  @IsUUID()
  optOutId!: string;
}
