import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';

@ArgsType()
@InputType()
export class ConnectionLogsRequest {
  @Field({ nullable: true })
  readonly pagination?: Pagination;
}
