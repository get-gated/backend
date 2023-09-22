import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import {
  Overrule,
  Rule,
  Verdict,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { v4 as uuidv4 } from 'uuid';
import GatekeeperDecisionInterface from '@app/interfaces/gatekeeper/gatekeeper-decision.interface';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import ChallengeEntity from '../../challenge/entities/challenge.entity';
import ConnectionEntity from '../../service-provider/entities/connection.entity';
import HistoryMessageEntity from '../../service-provider/entities/history-message.entity';

import TrainingEntity from './training.entity';
import PatternEntity from './pattern.entity';
import { AllowedThreadEntity } from './allowed-thread.entity';
import OptOutAddressEntity from './opt-out-address.entity';

export type IDecisionEntityConstructor = Omit<
  GatekeeperDecisionInterface,
  'decisionId' | 'decidedAt'
>;

registerEnumType(Verdict, { name: 'VerdictEnum' });
registerEnumType(Rule, { name: 'RuleEnum' });
registerEnumType(Overrule, { name: 'OverruleEnum' });

@Entity({ tableName: 'gatekeeper_decisions' })
@ObjectType('Decision')
export default class DecisionEntity extends GatekeeperDecisionInterface {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override decisionId!: string;

  [PrimaryKeyType]!: string;

  @Property({ index: true, type: 'uuid' })
  override userId!: string;

  @Property({ type: 'uuid' })
  override connectionId!: string;

  @Field()
  @Property()
  override emailAddress!: string;

  @Property({ type: 'uuid' })
  @Index()
  override messageId!: string;

  @Property({ type: 'uuid' })
  override threadId!: string;

  @Property({ type: 'uuid', nullable: true })
  override enforcedTrainingId?: string;

  @Property({ type: 'uuid', nullable: true })
  override enforcedPatternId?: string;

  @Property({ type: 'uuid', nullable: true })
  override enforcedOptOutAddressId?: string;

  @Property({ type: 'uuid', nullable: true })
  allowedThreadId?: string;

  @Field(() => Verdict)
  @Enum(() => Verdict)
  override verdict!: Verdict;

  @Field(() => Rule)
  @Enum(() => Rule)
  override ruling!: Rule;

  @Field(() => Overrule, { nullable: true })
  @Enum({ items: () => Overrule, nullable: true })
  override overrulingMade?: Overrule;

  @Field()
  @Property()
  override decidedAt!: Date;

  constructor(props: IDecisionEntityConstructor) {
    const overrideProps = {
      decisionId: uuidv4(),
      decidedAt: new Date(),
    };
    super({ ...props, ...overrideProps });
  }

  // graphql extensions
  @Field(() => ChallengeEntity, { nullable: true })
  challenge!: ChallengeEntity;

  @Field(() => ConnectionEntity)
  connection!: ConnectionEntity;

  @Field(() => HistoryMessageEntity)
  message!: HistoryMessageEntity;

  @Field(() => TrainingEntity, { nullable: true })
  enforcedTraining?: TrainingEntity;

  @Field(() => PatternEntity, { nullable: true })
  enforcedPattern?: PatternEntity;

  @Field(() => OptOutAddressEntity, { nullable: true })
  enforcedOptOutAddress?: OptOutAddressEntity;

  @Field(() => AllowedThreadEntity, { nullable: true })
  allowedThread?: AllowedThreadEntity;
}
