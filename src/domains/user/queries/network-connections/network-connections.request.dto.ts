import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';

@ArgsType()
@InputType()
export class NetworkConnectionsFilter {
  @Field({ nullable: true })
  isUsingGated?: boolean;

  @Field({ nullable: true })
  isNotUsingGated?: boolean;
}

@InputType('NetworkConnectionsInput')
export class NetworkConnectionsRequestDto {
  @Field({ nullable: true })
  readonly pagination?: Pagination;

  @Field({ nullable: true })
  readonly filter?: NetworkConnectionsFilter;
}
