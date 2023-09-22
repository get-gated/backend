import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';
import { v4 as uuidv4 } from 'uuid';

import Connection from './connection.entity';
import HistoryThreadEntity from './history-thread.entity';

type IMoveThreadLogConstructor = Omit<
  // eslint-disable-next-line no-use-before-define
  MoveThreadLogEntity,
  'moveThreadId' | 'createdAt' | 'moveAcknowledged' | typeof PrimaryKeyType
>;

@Entity({ tableName: 'service_provider_thread_moves' })
@Index({ properties: ['connection', 'thread'] })
export default class MoveThreadLogEntity {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  moveThreadId: string;

  [PrimaryKeyType]!: string;

  @ManyToOne()
  connection: Connection;

  @ManyToOne()
  @Index()
  thread: HistoryThreadEntity;

  @Enum(() => Label)
  destination: Label;

  @Property()
  @Index()
  createdAt: Date;

  @Property({ nullable: true })
  moveAcknowledged?: boolean;

  constructor(props: IMoveThreadLogConstructor) {
    this.moveThreadId = uuidv4();
    this.createdAt = new Date();
    this.destination = props.destination;
    this.thread = props.thread;
    this.connection = props.connection;
    this.moveAcknowledged = false;
  }
}
