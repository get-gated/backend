import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';
import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';

import { IMessagesQueryFilter } from './messages.query';

@ArgsType()
@InputType()
export class MessagesRequestFilter implements IMessagesQueryFilter {
  @Field(() => MessageType, { nullable: true })
  type?: MessageType;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Date, { nullable: true })
  after?: Date;

  @Field(() => Date, { nullable: true })
  before?: Date;
}

@InputType('MessagesInput')
export class MessagesRequest {
  @Field({ nullable: true })
  readonly pagination?: Pagination;

  @Field({ nullable: true })
  readonly filter?: MessagesRequestFilter;
}
