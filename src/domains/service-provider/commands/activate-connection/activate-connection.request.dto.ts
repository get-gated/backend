import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType('ConnectionActivateInput')
export class ActivateConnectionRequest {
  @Field()
  @IsUUID()
  connectionId!: string;
}
