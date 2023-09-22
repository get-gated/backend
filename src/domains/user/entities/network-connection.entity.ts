import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserNetworkConnectionInterface } from '@app/interfaces/user/user-network-connection.interface';

import UserEntity from './user.entity';

interface IUserTaskEntityConstructor
  extends Omit<
    UserNetworkConnectionInterface,
    'networkConnectionId' | 'userId' | 'gatedUserId' | 'createdAt' | 'updatedAt'
  > {
  user: UserEntity;
  gatedUser?: UserEntity;
}

@Entity({ tableName: 'user_network_connections' })
@ObjectType('NetworkConnection')
export default class UserNetworkConnectionEntity extends UserNetworkConnectionInterface {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override networkConnectionId!: string;

  [PrimaryKeyType]!: string;

  @ManyToOne(() => UserEntity)
  @Index()
  user: UserEntity;

  @Property()
  @Field()
  override name!: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override avatar?: string;

  @Property()
  @Field()
  @Index()
  override externalIdentifier!: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  gatedUser?: UserEntity;

  @Property()
  @Field()
  override metWithGated!: boolean;

  @Property()
  @Field()
  override createdAt!: Date;

  @Property({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: Date;

  @Field()
  @Property({ persist: false })
  get joinedAt(): Date | undefined {
    return this.gatedUser?.joinedAt;
  }

  @Property({ persist: false })
  get userId(): string {
    return this.user.userId;
  }

  @Property({ persist: false })
  get gatedUserId(): string | undefined {
    return this.gatedUser?.userId;
  }

  constructor(props: IUserTaskEntityConstructor) {
    const overrideProps = {
      networkConnectionId: uuidv4(),
      createdAt: new Date(),
    };
    super({
      userId: props.user.userId,
      gatedUserId: props.gatedUser?.userId,
      ...props,
      ...overrideProps,
    });
    this.user = props.user;
  }
}
