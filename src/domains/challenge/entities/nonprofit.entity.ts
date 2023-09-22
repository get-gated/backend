import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import ChallengeNonprofitInterface from '@app/interfaces/challenge/challenge-nonprofit.interface';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import slugify from 'slugify';

import NonprofitCategoryEntity from './nonprofit-category.entity';

interface AddFields {
  category: NonprofitCategoryEntity;
}

interface INonprofitEntity extends ChallengeNonprofitInterface, AddFields {}

interface INonprofitEntityConstructor
  extends Omit<ChallengeNonprofitInterface, 'nonprofitId' | 'slug'>,
    AddFields {}

@Entity({ tableName: 'challenge_nonprofits' })
@ObjectType('Nonprofit')
export default class NonprofitEntity
  extends ChallengeNonprofitInterface
  implements INonprofitEntity
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override nonprofitId!: string;

  [PrimaryKeyType]!: string;

  @Property()
  @Field()
  override name!: string;

  @Property({ columnType: 'text' })
  @Field()
  override description!: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override externalId?: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override ein?: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override url?: string;

  @ManyToOne({ eager: true })
  @Field(() => NonprofitCategoryEntity)
  category: NonprofitCategoryEntity;

  @Property({ length: 1000, nullable: true })
  @Field({ nullable: true })
  override logo?: string;

  @Property({ length: 1000, nullable: true })
  @Field({ nullable: true })
  override art?: string;

  @Property()
  @Field()
  override isDefault?: boolean;

  @Property()
  @Field({ nullable: true })
  override isFeatured?: boolean;

  @Property()
  @Field()
  override isDisplayed!: boolean;

  @Property({ nullable: true, length: 1000 })
  @Field({ nullable: true })
  @Index()
  override slug?: string;

  @Property({ persist: false })
  get categoryId(): string {
    return this.category.nonprofitCategoryId;
  }

  constructor(props: INonprofitEntityConstructor) {
    const overrideProps = {
      nonprofitId: uuidv4(),
      slug: slugify(props.name, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: true,
        locale: 'en',
        trim: true,
      }),
    };
    super({ ...props, ...overrideProps });

    this.category = props.category;
    this.isDefault = false;
  }
}
