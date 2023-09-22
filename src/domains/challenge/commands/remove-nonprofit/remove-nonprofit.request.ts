import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType('NonprofitRemoveInput')
export class NonprofitRemoveRequest {
  @Field()
  @IsUUID()
  nonprofitId!: string;
}
