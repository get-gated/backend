import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';

@ArgsType()
@InputType()
export class ChallengesRequestFilter {
  @Field(() => String, { nullable: true })
  recipient?: string;
}

@InputType('ChallengesInput')
export class ChallengesRequest {
  @Field({ nullable: true })
  readonly pagination?: Pagination;

  @Field({ nullable: true })
  readonly filter?: ChallengesRequestFilter;
}
