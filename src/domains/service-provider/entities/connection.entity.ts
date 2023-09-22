import {
  Entity,
  EntityRepositoryType,
  Enum,
  Index,
  OneToMany,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import {
  Provider,
  Status,
} from '@app/interfaces/service-provider/service-provider.enums';
import { ConnectionInterface } from '@app/interfaces/service-provider/connection.interface';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import ChallengeConnectionSettingEntity from '../../challenge/entities/connection-setting.entity';
import { ManagedBy } from '../service-provider.enums';

import ConnectionRepository from './repositories/connection.repository';
import ConnectionLogEntity from './connection-log.entity';
import SyncEntity from './sync.entity';

interface AddFields {
  externalAccessToken: string;
  externalAccountId: string;
  providerToken: string;
  providerUserId: string;
  legacyConnectionId?: string | null;
}

export interface IConnectionEntityConstructor
  extends Omit<ConnectionInterface, 'connectionId' | 'createdAt' | 'updatedAt'>,
    AddFields {}

interface IConnectionEntity extends ConnectionInterface, AddFields {}

registerEnumType(Provider, { name: 'ProviderEnum' });
registerEnumType(Status, { name: 'StatusEnum' });
registerEnumType(ManagedBy, { name: 'ManagedByEnum' });

@Entity({ tableName: 'service_provider_connections' })
@ObjectType('Connection')
export default class ConnectionEntity
  extends ConnectionInterface
  implements IConnectionEntity
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override connectionId!: string;

  [PrimaryKeyType]!: string;

  @Property({ type: 'uuid' })
  override userId!: string;

  @Property({ index: true })
  @Field()
  override emailAddress!: string;

  @Property()
  @Index()
  providerUserId: string;

  @Property({ length: 2048 })
  externalAccessToken: string;

  @Index()
  @Property()
  externalAccountId: string;

  @Enum(() => Provider)
  @Field(() => Provider)
  override provider!: Provider;

  @Property({ length: 2048 })
  providerToken: string;

  @Enum(() => Status)
  @Field(() => Status)
  override status!: Status;

  @OneToMany(() => ConnectionLogEntity, (log) => log.connection)
  @Field(() => [ConnectionLogEntity])
  logs!: ConnectionLogEntity[];

  @Property()
  @Field()
  override createdAt!: Date;

  @Field(() => [SyncEntity])
  syncs!: SyncEntity[];

  @Enum(() => ManagedBy)
  @Field(() => ManagedBy)
  managedBy: ManagedBy;

  @Property({ nullable: true })
  lastHistoryId?: string | null; // only used for google

  @Property({ nullable: true })
  @Index()
  lastHistoryProcessedAt?: Date | null; // only used for google

  @Property({ persist: false })
  get isActive(): boolean {
    return this.isActivated && this.status === Status.Running;
  }

  @Property()
  @Field()
  override isActivated!: boolean;

  @Field()
  isSyncing!: boolean;

  @Property()
  @Field()
  override isDisabled!: boolean;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override deletedAt?: Date;

  @Property({ nullable: true })
  override updatedAt?: Date;

  @Property()
  gatedLabelId!: string;

  @Property()
  expectedLabelId!: string;

  @Property()
  donatedLabelId!: string;

  @Property({ nullable: true })
  trainAsGatedLabelId?: string;

  @Property({ nullable: true })
  trainAsAllowedLabelId?: string;

  @Property({ nullable: true })
  legacyConnectionId?: string | null;

  [EntityRepositoryType]?: ConnectionRepository;

  constructor(props: IConnectionEntityConstructor) {
    const now = new Date();
    const overrideProps = {
      connectionId: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    super({ ...props, ...overrideProps });

    this.externalAccountId = props.externalAccountId;
    this.externalAccessToken = props.externalAccessToken;
    this.providerToken = props.providerToken;
    this.providerUserId = props.providerUserId;
    this.legacyConnectionId = props.legacyConnectionId;
    this.managedBy = ManagedBy.Internal;
  }

  // graphql extensions
  @Field(() => ChallengeConnectionSettingEntity)
  challengeSettings!: ChallengeConnectionSettingEntity;
}
