import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';
@ArgsType()
@InputType('NotificationsInput')
export class NotificationsRequest {
  @Field({ nullable: true })
  readonly pagination?: Pagination;
}
