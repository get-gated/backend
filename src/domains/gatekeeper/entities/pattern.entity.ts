import {
  Entity,
  Enum,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import GatekeeperPatternInterface from '@app/interfaces/gatekeeper/gatekeeper-pattern.interface';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType } from '@nestjs/graphql';

type IPatternEntity = Omit<
  GatekeeperPatternInterface,
  'patternId' | 'createdAt' | 'deletedAt' | 'updatedAt'
>;

@Entity({ tableName: 'gatekeeper_patterns' })
@ObjectType('Pattern')
export default class PatternEntity
  extends GatekeeperPatternInterface
  implements GatekeeperPatternInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override patternId!: string;

  [PrimaryKeyType]!: string;

  @Property()
  @Field()
  override name!: string;

  @Property({ type: 'text', nullable: true })
  @Field({ nullable: true })
  override description?: string;

  @Property()
  @Field()
  override expression!: string;

  @Enum(() => Rule)
  @Field(() => Rule)
  override rule!: Rule;

  @Property()
  @Field()
  override createdAt!: Date;

  @Property()
  @Field()
  override updatedAt!: Date;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override deletedAt?: Date;

  constructor(props: IPatternEntity) {
    const overrideProps = {
      patternId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    super({ ...props, ...overrideProps });
  }
}
