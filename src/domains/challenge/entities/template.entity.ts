import { Entity, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core';
import ChallengeTemplateInterface from '@app/interfaces/challenge/challenge-template.interface';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType } from '@nestjs/graphql';

type IChallengeTemplateConstructor = Omit<
  ChallengeTemplateInterface,
  'challengeTemplateId' | 'updatedAt' | 'createdAt'
>;

@Entity({ tableName: 'challenge_templates' })
@ObjectType('ChallengeTemplate')
export default class ChallengeTemplateEntity
  extends ChallengeTemplateInterface
  implements ChallengeTemplateInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override challengeTemplateId!: string;

  [PrimaryKeyType]!: string;

  @Property()
  @Field()
  override name!: string;

  @Property({ columnType: 'text' })
  @Field()
  override body!: string;

  @Property()
  @Field()
  override isEnabled!: boolean;

  @Property({ columnType: 'text' })
  @Field()
  override greetingBlock!: string;

  @Property({ columnType: 'text' })
  @Field()
  override leadBlock!: string;

  @Property({ columnType: 'text' })
  @Field()
  override donateBlock!: string;

  @Property({ columnType: 'text' })
  @Field()
  override expectedBlock!: string;

  @Property({ columnType: 'text' })
  @Field()
  override signatureBlock!: string;

  @Property()
  @Field()
  override createdAt!: Date;

  @Property()
  @Field()
  override updatedAt!: Date;

  constructor(props: IChallengeTemplateConstructor) {
    const now = new Date();
    const overrideProps = {
      challengeTemplateId: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    super({ ...props, ...overrideProps });
  }
}
