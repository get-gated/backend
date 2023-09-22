import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';

import {
  SentReceivedStatSortBy,
  SentReceivedStatType,
} from './sent-received-stats.enums';

registerEnumType(SentReceivedStatType, { name: 'SentReceivedStatTypeEnum' });
registerEnumType(SentReceivedStatSortBy, {
  name: 'SentReceivedStatSortByEnum',
});

@InputType('SentReceivedStatsFilterInput')
class SentReceivedStatsFilter {
  @Field({ nullable: true })
  query?: string;

  @Field({ nullable: true })
  receivedCountGreaterThan?: number;

  @Field({ nullable: true })
  receivedCountLessThan?: number;

  @Field({ nullable: true })
  sentCountGreaterThan?: number;

  @Field({ nullable: true })
  sentCountLessThan?: number;

  @Field({ nullable: true })
  firstSeenAtSince?: Date;

  @Field({ nullable: true })
  firstSeenAtBefore?: Date;

  @Field({ nullable: true })
  lastSeenAtSince?: Date;

  @Field({ nullable: true })
  lastSeenAtBefore?: Date;

  @Field({ nullable: true, description: 'Limit results to a specific domain' })
  forDomain?: string;
}

@InputType('SentReceivedStatsInput')
export class SentReceivedStatsRequestDto {
  @Field({ nullable: true })
  pagination?: Pagination;

  @Field(() => SentReceivedStatType)
  type!: SentReceivedStatType;

  @Field({ nullable: true })
  filter!: SentReceivedStatsFilter;

  @Field(() => SentReceivedStatSortBy, {
    nullable: true,
    defaultValue: SentReceivedStatSortBy.ReceivedCount,
  })
  sortBy: SentReceivedStatSortBy = SentReceivedStatSortBy.ReceivedCount;
}
