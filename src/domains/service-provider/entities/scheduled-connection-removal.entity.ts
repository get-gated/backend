import {
  Entity,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID } from '@nestjs/graphql';

type IConnectionLogEntityConstructor = Omit<
  // eslint-disable-next-line no-use-before-define
  ScheduledConnectionRemovalEntity,
  | 'scheduleId'
  | 'createdAt'
  | typeof PrimaryKeyType
  | 'completedAt'
  | 'isCompleted'
>;

@Entity({ tableName: 'service_provider_scheduled_connection_removals' })
export default class ScheduledConnectionRemovalEntity {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  scheduleId: string;

  [PrimaryKeyType]!: string;

  @Property()
  @Index()
  connectionId: string;

  @Property()
  @Index()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  @Index()
  completedAt?: Date;

  constructor(props: IConnectionLogEntityConstructor) {
    this.scheduleId = uuidv4();
    this.connectionId = props.connectionId;
    this.createdAt = new Date();
  }
}
