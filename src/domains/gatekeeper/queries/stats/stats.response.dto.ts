import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Stats')
export class Stats {
  @Field(() => Int)
  totalCount!: number;

  @Field(() => Int)
  gatedCount!: number;

  @Field(() => Int)
  allowedCount!: number;
}

@ObjectType('StatsResponse')
export class StatsResponse {
  @Field(() => Stats)
  monthToDate!: Stats;

  @Field(() => Stats)
  lastMonth!: Stats;

  @Field(() => Stats)
  yearToDate!: Stats;

  @Field(() => Stats)
  allTime!: Stats;

  @Field(() => Stats)
  lastThirtyDays!: Stats;

  @Field(() => Stats)
  previousThirtyDays!: Stats;
}
