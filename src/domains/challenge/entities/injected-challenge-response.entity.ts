import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { InjectMessageInterface } from '@app/interfaces/service-provider/inject-message.interface';
import { Field, ID } from '@nestjs/graphql';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

export interface IChallengeEntityConstructor extends InjectMessageInterface {
  messageId: string;
  userId: string;
  respondingTo: ChallengeInteraction.Donated | ChallengeInteraction.Expected;
}

@Entity({ tableName: 'challenge_injected_messages' })
@Index({ properties: ['connectionId', 'replyToMessageId'] })
export default class InjectedChallengeResponseEntity
  extends InjectMessageInterface
  implements InjectMessageInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  injectedChallengeResponseId: string;

  [PrimaryKeyType]!: string;

  @Property({ type: 'uuid' })
  messageId: string;

  @Property({ type: 'uuid' })
  userId: string;

  @Property({ type: 'uuid' })
  override connectionId!: string;

  @Property({ columnType: 'text' })
  override body!: string;

  @Property({ type: 'uuid' })
  override replyToMessageId!: string;

  @Enum(() => ChallengeInteraction)
  respondingTo: ChallengeInteraction;

  @Property()
  override fromEmail!: string;

  @Property()
  createdAt: Date;

  constructor(props: IChallengeEntityConstructor) {
    super(props);
    this.injectedChallengeResponseId = uuidv4();
    this.createdAt = new Date();
    this.messageId = props.messageId;
    this.userId = props.userId;
    this.respondingTo = props.respondingTo;
  }
}
