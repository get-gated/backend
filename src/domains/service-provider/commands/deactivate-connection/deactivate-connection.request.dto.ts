import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType('ConnectionDeactivateInput')
export class DeactivateConnectionRequest {
  @Field()
  @IsUUID()
  connectionId!: string;
}
