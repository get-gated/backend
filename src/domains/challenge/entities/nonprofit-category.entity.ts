import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import ChallengeNonprofitCategoryInterface from '@app/interfaces/challenge/challenge-nonprofit-category.interface';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import NonprofitEntity from './nonprofit.entity';

interface AddFields {
  // eslint-disable-next-line no-use-before-define
  parentCategory?: NonprofitCategoryEntity;
}

interface INonprofitCategoryEntity
  extends AddFields,
    ChallengeNonprofitCategoryInterface {}

interface INonprofitCategoryEntityConstructor
  extends AddFields,
    Omit<
      ChallengeNonprofitCategoryInterface,
      'nonprofitCategoryId' | 'parentNonprofitCategoryId'
    > {}

@Entity({ tableName: 'challenge_nonprofit_categories' })
@ObjectType('NonprofitCategory')
export default class NonprofitCategoryEntity
  extends ChallengeNonprofitCategoryInterface
  implements INonprofitCategoryEntity
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override nonprofitCategoryId!: string;

  [PrimaryKeyType]!: string;

  @Property()
  @Field()
  override name!: string;

  @Property({ columnType: 'text' })
  @Field()
  override description!: string;

  @ManyToOne({ nullable: true })
  @Field(() => NonprofitCategoryEntity, { nullable: true })
  parentCategory?: NonprofitCategoryEntity;

  @OneToMany(
    () => NonprofitCategoryEntity,
    (category) => category.parentCategory,
  )
  @Field(() => [NonprofitCategoryEntity], { nullable: true })
  childrenCategories?: NonprofitCategoryEntity[];

  @OneToMany(() => NonprofitEntity, (nonprofit) => nonprofit.category)
  @Field(() => [NonprofitEntity])
  nonprofits!: NonprofitEntity[];

  @Property({ persist: false })
  get parentNonprofitCategoryId(): string | undefined {
    return this.parentCategory?.nonprofitCategoryId;
  }

  constructor(props: INonprofitCategoryEntityConstructor) {
    const overrideProps = {
      nonprofitCategoryId: uuidv4(),
    };
    super({ ...props, ...overrideProps });

    if (props.parentCategory) {
      this.parentCategory = props.parentCategory;
    }
  }
}
