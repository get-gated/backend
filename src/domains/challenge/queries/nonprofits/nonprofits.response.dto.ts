import { Field, ObjectType } from '@nestjs/graphql';

import NonprofitEntity from '../../entities/nonprofit.entity';

@ObjectType()
export class NonprofitsResponse {
  @Field(() => [NonprofitEntity])
  nonprofits!: NonprofitEntity[];
}
