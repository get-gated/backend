import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

import { PushData, PushError } from '../services/push/push.adapter';

import PushTokenEntity from './push-token.entity';

type PushTokenConstructor = Pick<
  // eslint-disable-next-line no-use-before-define
  PushReceiptEntity,
  'token' | 'body' | 'data' | 'badge' | 'externalReceiptId'
>;

@Entity({ tableName: 'notification_push_receipts' })
export default class PushReceiptEntity {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  pushReceiptId: string;

  [PrimaryKeyType]!: string;

  @ManyToOne(() => PushTokenEntity)
  @Index()
  token: PushTokenEntity;

  @Property()
  externalReceiptId: string;

  @Property()
  body: string;

  @Property({ nullable: true, type: 'json' })
  data: PushData;

  @Property()
  badge: number;

  @Property({ nullable: true })
  error?: PushError | null;

  @Property()
  sentAt: Date;

  @Property({ nullable: true })
  confirmedAt?: Date;

  constructor(props: PushTokenConstructor) {
    this.pushReceiptId = uuidv4();
    this.token = props.token;
    this.body = props.body;
    this.badge = props.badge;
    this.data = props.token;
    this.sentAt = new Date();
    this.externalReceiptId = props.externalReceiptId;
  }
}
