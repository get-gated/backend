import {
  Entity,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';

type PushTokenEntityConstructor = Pick<
  // eslint-disable-next-line no-use-before-define
  PushTokenEntity,
  'userId' | 'token' | 'device'
>;

@Entity({ tableName: 'notification_push_tokens' })
export default class PushTokenEntity {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  pushTokenId: string;

  [PrimaryKeyType]!: string;

  @Index()
  @Property({ type: 'uuid' })
  userId: string;

  @Property()
  @Index()
  @Unique()
  token: string;

  @Property()
  device: string;

  @Property()
  createdAt: Date;

  @Property({ nullable: true })
  deletedAt?: Date | null;

  constructor(props: PushTokenEntityConstructor) {
    this.pushTokenId = uuidv4();
    this.userId = props.userId;
    this.token = props.token;
    this.device = props.device;
    this.createdAt = new Date();
  }
}
