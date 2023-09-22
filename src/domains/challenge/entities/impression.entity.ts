import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Field } from '@nestjs/graphql';
import { ImpressionSource } from '@app/interfaces/challenge/challenge.enums';

import NonprofitEntity from './nonprofit.entity';

type IChallengeVisitorInteractionInterfaceConstructor = Pick<
  // eslint-disable-next-line no-use-before-define
  ChallengeNonprofitImpressionEntity,
  'nonprofit' | 'userId' | 'source'
>;

@Entity({ tableName: 'challenge_nonprofit_impressions' })
export default class ChallengeNonprofitImpressionEntity {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  impressionId: string;

  [PrimaryKeyType]!: string;

  @Property({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne()
  @Index()
  nonprofit: NonprofitEntity;

  @Enum(() => ImpressionSource)
  source: ImpressionSource;

  @Property()
  @Field()
  createdAt: Date;

  constructor(props: IChallengeVisitorInteractionInterfaceConstructor) {
    this.impressionId = uuidv4();
    this.createdAt = new Date();
    this.source = props.source;
    this.userId = props.userId;
    this.nonprofit = props.nonprofit;
  }
}
