import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import TrainingInterface from '@app/interfaces/gatekeeper/gatekeeper-training.interface';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

registerEnumType(TrainingOrigin, { name: 'TrainingOriginEnum' });

type ITrainingEntityConstructor = Omit<
  TrainingInterface,
  'trainingId' | 'createdAt'
>;

@Entity({ tableName: 'gatekeeper_trainings' })
@Index({ properties: ['username', 'domain'] })
@ObjectType('Training')
export default class TrainingEntity
  extends TrainingInterface
  implements TrainingInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  override trainingId!: string;

  [PrimaryKeyType]!: string;

  @Field(() => ID) // client needs a special ID so it only has latest version of training
  id!: string;

  @Property({ type: 'uuid' })
  @Index()
  override userId!: string;

  @Property({ nullable: true, length: 2048 })
  @Index()
  @Field({ nullable: true })
  override username?: string;

  @Property({ length: 2048 })
  @Index()
  @Field()
  override domain!: string;

  @Enum(() => Rule)
  @Field(() => Rule)
  override rule!: Rule;

  @Enum(() => TrainingOrigin)
  @Field(() => TrainingOrigin)
  override origin!: TrainingOrigin;

  @Property()
  @Field()
  @Index()
  override createdAt!: Date;

  @Field(() => Rule, {
    nullable: true,
    description:
      'There is upstream rule that will be inherited. Eg: domain training or pattern rule that applies to an unset address training',
  })
  inheritedRule?: Rule;

  @Field({
    nullable: true,
    description:
      'The `id` field is generated as an identifier of the username/domain for the training so that the latest version is always in cache. This field is if you need the internal identifier for a particular version of the training.',
  })
  versionId?: string;

  constructor(props: ITrainingEntityConstructor) {
    const overrideProps = {
      trainingId: uuidv4(),
      createdAt: new Date(),
    };
    super({ ...props, ...overrideProps });
  }
}
