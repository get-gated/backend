import { Entity, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import GatekeeperInjectedDecisionMessageInterface from '@app/interfaces/gatekeeper/gatekeeper-injected-decision-message.interface';

type InjectedDecisionMessageConstructor = Omit<
  GatekeeperInjectedDecisionMessageInterface,
  'injectedDecisionMessageId' | 'createdAt'
>;

@Entity({ tableName: 'gatekeeper_injected_decision_messages' })
@ObjectType('InjectedDecisionMessage')
export default class InjectedDecisionMessageEntity
  extends GatekeeperInjectedDecisionMessageInterface
  implements GatekeeperInjectedDecisionMessageInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override injectedDecisionMessageId!: string;

  [PrimaryKeyType]!: string;

  @Property({ index: true, type: 'uuid' })
  override userId!: string;

  @Property({ type: 'uuid' })
  override connectionId!: string;

  @Property({ type: 'uuid', index: true })
  override threadId!: string;

  @Property({ type: 'uuid' })
  override messageId!: string;

  @Property({ type: 'uuid' })
  override decisionId!: string;

  @Property({ columnType: 'text' })
  override body!: string;

  @Property()
  @Field()
  override createdAt!: Date;

  constructor(props: InjectedDecisionMessageConstructor) {
    const overrideProps = {
      injectedDecisionMessageId: uuidv4(),
      createdAt: new Date(),
    };
    super({ ...props, ...overrideProps });
  }
}
