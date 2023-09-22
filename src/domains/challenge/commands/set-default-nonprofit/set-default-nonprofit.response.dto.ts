import { Field, ObjectType } from '@nestjs/graphql';

import NonprofitEntity from '../../entities/nonprofit.entity';

@ObjectType()
export class SetDefaultNonprofitResponse {
  @Field(() => [NonprofitEntity])
  nonprofits!: NonprofitEntity[];
}
