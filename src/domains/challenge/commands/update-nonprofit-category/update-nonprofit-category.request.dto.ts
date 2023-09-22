import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { AddNonprofitCategoryRequest } from '../add-nonprofit-category/add-nonprofit-category.request.dto';

@InputType('NonprofitCategoryUpdateInput')
@ArgsType()
export class UpdateNonprofitCategoryRequest extends AddNonprofitCategoryRequest {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  nonprofitCategoryId!: string;
}
