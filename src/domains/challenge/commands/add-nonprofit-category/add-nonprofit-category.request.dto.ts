import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength } from 'class-validator';

@InputType('NonprofitCategoryAddInput')
@ArgsType()
export class AddNonprofitCategoryRequest {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Field()
  name!: string;

  @IsString()
  @Field({ nullable: true })
  description?: string;
}
