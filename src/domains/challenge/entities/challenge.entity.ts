import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import {
  ChallengeAction,
  ChallengeMode,
  ChallengeWithholdReason,
} from '@app/interfaces/challenge/challenge.enums';
import ChallengeInterface from '@app/interfaces/challenge/challenge.interface';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import ConnectionEntity from '../../service-provider/entities/connection.entity';
import HistoryMessageEntity from '../../service-provider/entities/history-message.entity';
import HistoryThreadEntity from '../../service-provider/entities/history-thread.entity';
import { ChallengeInteractionsResponse } from '../queries/challenge-interactions/challenge-interactions.response.dto';

import ChallengeInteractionEntity from './challenge-interaction.entity';
import NonprofitEntity from './nonprofit.entity';
import TemplateEntity from './template.entity';

export interface IChallengeEntityConstructor
  extends Omit<ChallengeInterface, 'createdAt' | 'templateId'> {
  nonprofit: NonprofitEntity;
  template: TemplateEntity;
  toNormalized: string;
}

registerEnumType(ChallengeAction, { name: 'ChallengeActionEnum' });
registerEnumType(ChallengeWithholdReason, {
  name: 'ChallengeWitholdReasonEnum',
});
registerEnumType(ChallengeMode, { name: 'ChallengeModeEnum' });

@Index({ properties: ['connectionId', 'toNormalized', 'createdAt'] })
@Entity({ tableName: 'challenges' })
@ObjectType('Challenge')
export default class ChallengeEntity
  extends ChallengeInterface
  implements ChallengeInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override challengeId!: string;

  [PrimaryKeyType]!: string;

  @Index()
  @Property({ type: 'uuid' })
  override userId!: string;

  @Property({ type: 'uuid' })
  override connectionId!: string;

  @Index()
  @Property()
  override threadId!: string;

  @Index()
  @Property()
  override messageId!: string;

  @Enum(() => ChallengeAction)
  @Field(() => ChallengeAction)
  override action!: ChallengeAction;

  @Enum({ items: () => ChallengeWithholdReason, nullable: true }) // only pertains to Withhold action
  @Field(() => ChallengeWithholdReason, { nullable: true })
  override withholdReason?: ChallengeWithholdReason;

  @ManyToOne({ eager: true })
  @Field(() => TemplateEntity)
  template: TemplateEntity;

  @ManyToOne()
  @Field(() => NonprofitEntity)
  nonprofit: NonprofitEntity;

  @Property()
  @Field()
  override to!: string;

  @Property()
  toNormalized: string;

  @Property({ columnType: 'text' })
  @Field()
  override body!: string;

  @Property()
  @Field()
  override createdAt!: Date;

  @Enum(() => ChallengeMode)
  @Field(() => ChallengeMode)
  override mode!: ChallengeMode;

  @Property({ type: 'uuid', nullable: true })
  override sentMessageId?: string;

  @Property()
  @Field()
  override injectResponses!: boolean;

  @OneToMany(
    () => ChallengeInteractionEntity,
    (interaction) => interaction.challenge,
  )
  @Field(() => ChallengeInteractionsResponse)
  interactions!: ChallengeInteractionEntity[];

  @Field({
    description: 'Challenge has a donation interaction from the sender',
  })
  hasDonation!: boolean;

  @Field({
    description: 'Challenge has a expected interaction from the sender',
  })
  hasExpected!: boolean;

  @Property({ persist: false })
  public get templateId(): string {
    return this.template.challengeTemplateId;
  }

  @Property({ persist: false })
  public get nonprofitId(): string {
    return this.nonprofit.nonprofitId;
  }

  constructor(props: IChallengeEntityConstructor) {
    const defaultProps = {
      challengeId: uuidv4(),
    };
    const overrideProps = {
      createdAt: new Date(),
    };

    super(Object.assign(defaultProps, props, overrideProps));

    this.template = props.template;
    this.nonprofit = props.nonprofit;
    this.toNormalized = props.toNormalized;
  }

  // graphql extensions
  @Field(() => ConnectionEntity)
  connection!: ConnectionEntity;

  @Field(() => HistoryMessageEntity)
  message!: HistoryMessageEntity;

  @Field(() => HistoryMessageEntity)
  sentMessage?: HistoryMessageEntity;

  @Field(() => HistoryThreadEntity)
  thread!: HistoryThreadEntity;
}
