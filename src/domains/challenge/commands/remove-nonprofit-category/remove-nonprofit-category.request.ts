import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType('NonprofitCategoryRemoveInput')
export class NonprofitCategoryRemoveRequest {
  @Field()
  @IsUUID()
  nonprofitCategoryId!: string;
}
