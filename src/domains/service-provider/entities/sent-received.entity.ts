import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
  Unique,
} from '@mikro-orm/core';
import {
  MessageType,
  ParticipantField,
} from '@app/interfaces/service-provider/service-provider.enums';
import { v4 as uuidv4 } from 'uuid';

import { MessageParticipantEntity } from './message-participant.entity';

type SentReceiveEntityConstructor = Omit<
  // eslint-disable-next-line no-use-before-define
  SentReceivedEntity,
  'sendReceiveId' | typeof PrimaryKeyType
>;

@Entity({ tableName: 'service_provider_sent_received' })
@Unique({
  properties: ['userId', 'externalMessageId', 'username', 'domain'],
  name: 'external_message_signature',
})
export class SentReceivedEntity {
  @PrimaryKey({ fieldName: 'id' })
  sendReceiveId: string;

  [PrimaryKeyType]!: string;

  @Property()
  @Index()
  userId: string;

  @Property({ nullable: true })
  @Index()
  connectionId?: string;

  @Property()
  externalMessageId: string;

  @Property({ length: 2048 })
  username: string;

  @Property({ length: 2048 })
  domain: string;

  @Enum(() => MessageType)
  type: MessageType;

  @Enum(() => ParticipantField)
  participantField: ParticipantField;

  @Property({ type: 'json' })
  participant: MessageParticipantEntity;

  @Property()
  createdAt: Date;

  constructor(props: SentReceiveEntityConstructor) {
    this.sendReceiveId = uuidv4();
    this.username = props.username;
    this.domain = props.domain;
    this.type = props.type;
    this.participant = props.participant;
    this.participantField = props.participantField;
    this.createdAt = props.createdAt;
    this.userId = props.userId;
    this.externalMessageId = props.externalMessageId;
    this.connectionId = props.connectionId;
  }
}
