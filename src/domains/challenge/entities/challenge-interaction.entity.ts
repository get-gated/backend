import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import {
  ChallengeInteraction,
  ExpectedConsent,
  ExpectedReason,
} from '@app/interfaces/challenge/challenge.enums';
import { ChallengeInteractionInterface } from '@app/interfaces/challenge/challenge-interaction.interface';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import ChallengeEntity from './challenge.entity';

interface IChallengeInteractionEntityConstructor
  extends Omit<
    ChallengeInteractionInterface,
    'challengeInteractionId' | 'performedAt'
  > {
  challenge: ChallengeEntity;
}

registerEnumType(ChallengeInteraction, { name: 'ChallengeInteractionEnum' });
registerEnumType(ExpectedReason, { name: 'ChallengeExpectedReasonEnum' });
registerEnumType(ExpectedConsent, { name: 'ChallengeExpectedConsentEnum' });

@Entity({ tableName: 'challenge_interactions' })
@ObjectType('ChallengeInteraction')
export default class ChallengeInteractionEntity
  extends ChallengeInteractionInterface
  implements ChallengeInteractionInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override challengeInteractionId!: string;

  [PrimaryKeyType]!: string;

  @ManyToOne(() => ChallengeEntity)
  @Field(() => ChallengeEntity)
  challenge: ChallengeEntity;

  @Enum(() => ChallengeInteraction)
  @Field(() => ChallengeInteraction)
  override interaction!: ChallengeInteraction;

  @Property({ type: 'uuid', nullable: true }) // only pertains to Donated interaction
  override paymentId?: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override paymentAmount?: number;

  @Property({ nullable: true }) // only pertains to UserReply interaction
  override userReplyMessageId?: string;

  @Property({ nullable: true, columnType: 'text' })
  @Field({ nullable: true })
  override personalizedNote?: string; // only pertains to Donated and Expected interactions

  @Enum({ items: () => ExpectedReason, nullable: true }) // only pertains to Expected interactions
  @Field(() => ExpectedReason, { nullable: true })
  override expectedReason?: ExpectedReason;

  @Property({ columnType: 'text', nullable: true }) // only pertains to Expected interactions
  @Field({ nullable: true })
  override expectedReasonDescription?: string;

  @Property({ nullable: true }) // only pertains to Expected interactions
  @Index()
  override expectedConsentId?: string;

  @Property()
  @Field()
  override performedAt!: Date;

  constructor(props: IChallengeInteractionEntityConstructor) {
    const defaultProps = {
      challengeInteractionId: uuidv4(),
    };

    const overrideProps = {
      performedAt: new Date(),
    };
    super(Object.assign(defaultProps, props, overrideProps));
    this.challenge = props.challenge;
  }
}
