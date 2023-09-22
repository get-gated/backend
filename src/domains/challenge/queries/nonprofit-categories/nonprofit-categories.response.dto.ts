import { Field, ObjectType } from '@nestjs/graphql';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';

@ObjectType()
export class NonprofitCategoriesResponse {
  @Field(() => [NonprofitCategoryEntity])
  nonprofitCategories!: NonprofitCategoryEntity[];
}
