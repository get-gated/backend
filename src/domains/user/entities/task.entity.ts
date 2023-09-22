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
import { UserTask, UserTaskResolution } from '@app/interfaces/user/user.enums';
import { UserTaskInterface } from '@app/interfaces/user/user-task.interface';

import UserEntity from './user.entity';

interface IUserTaskEntityConstructor
  extends Omit<
    UserTaskInterface,
    'taskId' | 'createdAt' | 'userId' | 'resolvedAt' | 'resolution'
  > {
  user: UserEntity;
}

registerEnumType(UserTask, { name: 'UserTaskEnum' });
registerEnumType(UserTaskResolution, { name: 'UserTaskResolutionEnum' });

@Entity({ tableName: 'user_tasks' })
@ObjectType('UserTask')
export default class UserTaskEntity extends UserTaskInterface {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override taskId!: string;

  [PrimaryKeyType]!: string;

  @ManyToOne(() => UserEntity)
  @Index()
  user: UserEntity;

  @Enum(() => UserTask)
  @Field(() => UserTask)
  override task!: UserTask;

  @Enum({ items: () => UserTaskResolution, nullable: true })
  @Field(() => UserTaskResolution, { nullable: true })
  override resolution?: UserTaskResolution;

  @Property()
  @Field()
  override createdAt!: Date;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override resolvedAt?: Date;

  @Property({ persist: false })
  get userId(): string {
    return this.user.userId;
  }

  constructor(props: IUserTaskEntityConstructor) {
    const overrideProps = {
      taskId: uuidv4(),
      createdAt: new Date(),
    };
    super({ userId: props.user.userId, ...props, ...overrideProps });
    this.user = props.user;
  }
}
