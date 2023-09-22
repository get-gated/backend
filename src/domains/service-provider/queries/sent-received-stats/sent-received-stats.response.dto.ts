import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import SentReceivedStatEntity from '../../entities/sent-received-stat.entity';

@ObjectType('SentReceivedStatsEdge')
export class SentReceivedStatsEdge extends Edge<SentReceivedStatEntity> {
  @Field(() => SentReceivedStatEntity)
  node: SentReceivedStatEntity;

  constructor(props: SentReceivedStatsEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('SentReceivedStatsConnection')
export class SentReceivedStatsResponseDto extends Connection<SentReceivedStatEntity> {
  @Field(() => [SentReceivedStatsEdge])
  edges: SentReceivedStatsEdge[];

  constructor(props: SentReceivedStatsResponseDto) {
    super(props);
    this.edges = props.edges;
  }
}
