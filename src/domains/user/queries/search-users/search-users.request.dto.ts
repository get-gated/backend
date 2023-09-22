import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class SearchUsersRequest {
  @Field()
  query!: string;
}
