import {
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import ChallengeUserSettingsInterface from '@app/interfaces/challenge/challenge-user-settings.interface';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import NonprofitEntity from './nonprofit.entity';

export interface IChallengeUserSettingEntityConstructor
  extends Omit<
    ChallengeUserSettingsInterface,
    'updatedAt' | 'challengeUserSettingId'
  > {
  nonprofit: NonprofitEntity;
}

@Entity({ tableName: 'challenge_user_settings' })
@ObjectType('ChallengeUserSetting')
export default class ChallengeUserSettingEntity
  extends ChallengeUserSettingsInterface
  implements ChallengeUserSettingsInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override challengeUserSettingId!: string;

  [PrimaryKeyType]!: string;

  @Property({ type: 'uuid' })
  override userId!: string;

  @ManyToOne({ eager: true })
  @Field(() => NonprofitEntity)
  nonprofit: NonprofitEntity;

  @Property()
  @Field()
  override updatedAt!: Date;

  @Property({ nullable: true })
  @Field({
    description: 'Minimum allowed donation for user, represented in cents',
  })
  override minimumDonation!: number;

  @Property({ columnType: 'text' })
  @Field()
  override signature!: string;

  @Property()
  @Field()
  override injectResponses!: boolean;

  @Property({ columnType: 'text', nullable: true })
  @Field({ nullable: true })
  override nonprofitReason?: string;

  @Property({ persist: false })
  get nonprofitId(): string {
    return this.nonprofit.nonprofitId;
  }

  constructor(props: IChallengeUserSettingEntityConstructor) {
    const overrideProps = {
      challengeUserSettingId: uuidv4(),
      updatedAt: new Date(),
    };

    const defaultProps = {
      injectResponses: true,
    };

    super(Object.assign(defaultProps, props, overrideProps));
    this.nonprofit = props.nonprofit;
  }
}
