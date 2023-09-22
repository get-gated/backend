import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('NonprofitSetDefaultInput')
export class SetDefaultNonprofitRequest {
  @IsUUID()
  @Field()
  @IsNotEmpty()
  nonprofitId!: string;
}
