import { Field, ObjectType } from '@nestjs/graphql';

import { StatsQueryHandlerResponse } from './donation-request-stats.query-handler';

@ObjectType('DonationRequestStatsResponse')
export class DonationRequestStatsResponseDto
  implements StatsQueryHandlerResponse
{
  @Field()
  donationTotal!: number;

  @Field()
  viewCount!: number;

  @Field()
  donationCount!: number;
}
