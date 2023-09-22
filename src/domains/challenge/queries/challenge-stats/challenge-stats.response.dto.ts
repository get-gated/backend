import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChallengeStatsResponse {
  @Field()
  donationTotal!: number;

  @Field()
  donationCount!: number;

  @Field()
  donationAllTimeHigh!: number;

  @Field()
  challengesSent!: number;
}
