import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ChallengeMode } from '@app/interfaces/challenge/challenge.enums';
import ChallengeConnectionSettingsInterface from '@app/interfaces/challenge/challenge-connection-settings.interface';

import TemplateEntity from './template.entity';

interface AddFields {
  template?: TemplateEntity;
}
export interface IChallengeConnectionSettingEntityConstructor
  extends Omit<
      ChallengeConnectionSettingsInterface,
      'challengeConnectionSettingId' | 'mode' | 'updatedAt' | 'templateId'
    >,
    AddFields {
  mode?: ChallengeMode; // mode is optional on the constructor. Defaults to Send
  template?: TemplateEntity;
}

interface IChallengeConnectionSettingEntity
  extends ChallengeConnectionSettingsInterface,
    AddFields {}

registerEnumType(ChallengeMode, { name: 'ChallengeModeEnum' });

@Entity({ tableName: 'challenge_connection_settings' })
@ObjectType('ChallengeConnectionSetting')
export default class ChallengeConnectionSettingEntity
  extends ChallengeConnectionSettingsInterface
  implements IChallengeConnectionSettingEntity
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override challengeConnectionSettingId!: string;

  [PrimaryKeyType]!: string;

  @Property({ type: 'uuid' })
  @Index()
  override connectionId!: string;

  @Property({ type: 'uuid' })
  override userId!: string;

  @ManyToOne({ nullable: true })
  @Field(() => TemplateEntity, { nullable: true })
  template?: TemplateEntity; // optional if user is to override default

  @Enum(() => ChallengeMode)
  @Field(() => ChallengeMode)
  override mode!: ChallengeMode;

  @Property()
  @Field()
  override updatedAt!: Date;

  @Property({ columnType: 'text', nullable: true })
  @Field({ nullable: true })
  override greetingBlock?: string;

  @Property({ columnType: 'text', nullable: true })
  @Field({ nullable: true })
  override leadBlock?: string;

  @Property({ columnType: 'text', nullable: true })
  @Field({ nullable: true })
  override donateBlock?: string;

  @Property({ columnType: 'text', nullable: true })
  @Field({ nullable: true })
  override expectedBlock?: string;

  @Property({ columnType: 'text', nullable: true })
  @Field({ nullable: true })
  override signatureBlock?: string;

  @Property({ persist: false, nullable: true })
  get templateId(): string | undefined {
    return this.template?.challengeTemplateId;
  }

  constructor(props: IChallengeConnectionSettingEntityConstructor) {
    const defaultProps = {
      mode: ChallengeMode.Send,
    };
    const overrideProps = {
      challengeConnectionSettingId: uuidv4(),
      updatedAt: new Date(),
    };

    super(Object.assign(defaultProps, props, overrideProps));

    this.template = props.template;
  }
}
