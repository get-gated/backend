import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import ConnectionEntity from './connection.entity';

type IConnectionLogEntityConstructor = Omit<
  // eslint-disable-next-line no-use-before-define
  ConnectionLogEntity,
  'connectionLogId' | 'createdAt' | typeof PrimaryKeyType
>;

@Entity({ tableName: 'service_provider_connection_logs' })
@ObjectType('ConnectionLog')
export default class ConnectionLogEntity {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  connectionLogId: string;

  [PrimaryKeyType]!: string;

  @ManyToOne(() => ConnectionEntity)
  @Field(() => ConnectionEntity)
  connection: ConnectionEntity;

  @Enum(() => Status)
  @Field(() => Status)
  status!: Status;

  @Property({ type: 'boolean', nullable: true })
  @Field({ nullable: true })
  isActivated?: boolean;

  @Property()
  @Field()
  createdAt: Date = new Date();

  constructor(props: IConnectionLogEntityConstructor) {
    this.connectionLogId = uuidv4();
    this.connection = props.connection;
    this.status = props.status;
    this.isActivated = props.isActivated;
    this.createdAt = new Date();
  }
}
