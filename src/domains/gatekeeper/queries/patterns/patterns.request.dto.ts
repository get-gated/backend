import { Field, InputType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

@InputType()
export class PatternsRequestFilter {
  @Field(() => [Rule], { nullable: true })
  rule?: string[];

  @Field(() => String, { nullable: true })
  test?: string;

  @Field(() => String, { nullable: true })
  search?: string;
}

@InputType('PatternsInput')
export class PatternsRequest {
  @Field({ nullable: true })
  readonly pagination?: Pagination;

  @Field({ nullable: true })
  readonly filter?: PatternsRequestFilter;
}
