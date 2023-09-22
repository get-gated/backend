import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { ConnectionSyncInterface } from '@app/interfaces/service-provider/connection-sync.interface';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';
import { SyncType } from '@app/interfaces/service-provider/service-provider.enums';

import ConnectionEntity from './connection.entity';

interface AddFields {
  connection: ConnectionEntity;
}

interface ISyncEntity extends ConnectionSyncInterface, AddFields {}

type ISyncEntityConstructor = Omit<
  ISyncEntity,
  'isFinished' | 'connectionId' | 'startedAt' | 'connectionSyncId' | 'isSyncing'
>;

registerEnumType(SyncType, { name: 'SyncTypeEnum' });

@Entity({ tableName: 'service_provider_connection_syncs' })
@ObjectType('ConnectionSync')
export default class SyncEntity
  extends ConnectionSyncInterface
  implements ISyncEntity
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override connectionSyncId!: string;

  [PrimaryKeyType]!: string;

  @Field(() => ConnectionEntity)
  @ManyToOne(() => ConnectionEntity)
  connection: ConnectionEntity;

  @Property()
  @Field()
  override targetDepth!: Date;

  @Property({ nullable: true }) // if there is no initial results, we could never reach a depth
  @Field({ nullable: true })
  override lastDepth?: Date;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override startedAt?: Date;

  @Property({ nullable: true })
  override pageToken?: string | null;

  @Enum(() => SyncType)
  @Field(() => SyncType)
  override type!: SyncType;

  @Property({ nullable: true })
  @Field()
  override finishedAt?: Date;

  @Property()
  @Field()
  override isSyncing!: boolean;

  @Property({ persist: false })
  @Field(() => Boolean)
  get isFinished(): boolean {
    return Boolean(this.finishedAt);
  }

  @Property({ persist: false })
  get connectionId(): string {
    return this.connection.connectionId;
  }

  constructor(props: ISyncEntityConstructor) {
    const fields = {
      ...props,
      isFinished: Boolean(props.finishedAt),
      connectionId: props.connection.connectionId,
      connectionSyncId: uuidv4(),
      isSyncing: false,
    };
    super(fields);
    this.connection = props.connection;
  }
}
