import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class StatsForUserRequest {
  @Field()
  userId!: string;
}
