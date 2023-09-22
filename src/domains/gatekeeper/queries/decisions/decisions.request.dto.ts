import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

@ArgsType()
@InputType()
export class DecisionsRequestFilter {
  @Field(() => [Rule], { nullable: true })
  rulings?: Rule[];

  @Field(() => String, { nullable: true })
  search?: string;
}

@InputType('DecisionsInput')
export class DecisionsRequest {
  @Field({ nullable: true })
  readonly pagination?: Pagination;

  @Field({ nullable: true })
  readonly filter?: DecisionsRequestFilter;
}
