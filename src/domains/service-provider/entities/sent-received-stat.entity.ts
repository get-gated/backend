import { Field, ID, ObjectType } from '@nestjs/graphql';
import { graphqlUtils } from '@app/modules/graphql';

import TrainingEntity from '../../gatekeeper/entities/training.entity';

type ISendReceiveStatConstructor = Omit<
  // eslint-disable-next-line no-use-before-define
  SentReceivedStatEntity,
  'id' | 'training'
>;

@ObjectType('SentReceivedStat')
export default class SentReceivedStatEntity {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  username?: string;

  @Field()
  domain: string;

  @Field()
  receivedCount: number;

  @Field()
  sentCount: number;

  @Field({ nullable: true })
  firstSeenAt?: Date;

  @Field({ nullable: true })
  lastSeenAt?: Date;

  @Field(() => TrainingEntity, { nullable: true })
  training?: TrainingEntity;

  constructor(props: ISendReceiveStatConstructor) {
    this.id = graphqlUtils.encodeCursor(
      `${props.username || ''}@${props.domain}`,
    );
    this.username = props.username;
    this.domain = props.domain;
    this.receivedCount = props.receivedCount;
    this.sentCount = props.sentCount;
    this.firstSeenAt = props.firstSeenAt;
    this.lastSeenAt = props.lastSeenAt;
  }
}
