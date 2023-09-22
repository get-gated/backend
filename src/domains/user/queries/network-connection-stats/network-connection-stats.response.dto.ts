import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('NetworkConnectionStatsResponse')
export class NetworkConnectionStatsResponseDto {
  @Field(() => Int)
  allKnown!: number;

  @Field(() => Int)
  usingGated!: number;

  @Field(() => Int)
  metWithGated!: number;
}
