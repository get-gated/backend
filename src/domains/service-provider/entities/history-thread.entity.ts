import {
  Entity,
  EntityRepositoryType,
  Index,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { ThreadInterface } from '@app/interfaces/service-provider/thread.interface';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import ConnectionEntity from './connection.entity';
import HistoryThreadRepository from './repositories/history-thread.repository';

interface AddFields {
  externalThreadId: string;
  connection: ConnectionEntity;
}

interface IHistoryThreadEntity extends ThreadInterface, AddFields {}

export interface IHistoryThreadEntityConstructor
  extends Omit<ThreadInterface, 'threadId' | 'connectionId'>,
    AddFields {}

@Entity({ tableName: 'service_provider_threads' })
@ObjectType('Thread')
export default class HistoryThreadEntity
  extends ThreadInterface
  implements IHistoryThreadEntity
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override threadId!: string;

  [PrimaryKeyType]!: string;

  @ManyToOne()
  @Field(() => ConnectionEntity)
  connection!: ConnectionEntity;

  @Property({ type: 'uuid' })
  override userId!: string;

  @Index()
  @Property()
  externalThreadId: string;

  @Property()
  @Field()
  override firstMessageAt!: Date;

  @Property({ nullable: true })
  @Field({ nullable: true })
  createdAt?: Date;

  get connectionId(): string {
    return this.connection.connectionId;
  }

  [EntityRepositoryType]?: HistoryThreadRepository;

  constructor(props: IHistoryThreadEntityConstructor) {
    const overrideProps = {
      threadId: uuidv4(),
      connectionId: props.connection.connectionId,
    };
    super({ ...props, ...overrideProps });
    this.connection = props.connection;
    this.externalThreadId = props.externalThreadId;
    this.createdAt = new Date();
  }
}
