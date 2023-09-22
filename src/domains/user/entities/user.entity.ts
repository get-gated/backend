import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { UserInterface } from '@app/interfaces/user/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@app/modules/auth';

import TxEmailEntity from '../../notification/entities/tx-email.entity';
import ConnectionEntity from '../../service-provider/entities/connection.entity';
import OptOutAddressEntity from '../../gatekeeper/entities/opt-out-address.entity';
import NotificationUserSettingsEntity from '../../notification/entities/user-settings.entity';

import { UserPersonalizationEntity } from './personalization.entity';
import UserNetworkConnectionEntity from './network-connection.entity';

interface IUserEntityConstructor
  extends Omit<
    UserInterface,
    | 'userId'
    | 'joinedAt'
    | 'fullName'
    | 'isSignupCompleted'
    | 'isDisabled'
    | 'disabledAt'
    | 'referralCode'
    | 'handle'
  > {
  firstName: string;
  lastName: string;
  legacyUserId?: string;
  isSignupCompleted?: boolean;
  // eslint-disable-next-line no-use-before-define
  referredByUser?: UserEntity | null;
}

registerEnumType(Role, { name: 'UserRoleEnum' });

@Entity({ tableName: 'users' })
@ObjectType('User')
export default class UserEntity extends UserInterface {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override userId!: string;

  [PrimaryKeyType]!: string;

  @Property({ nullable: true })
  legacyUserId?: string;

  @Property()
  @Field()
  override firstName!: string;

  @Property()
  @Field()
  override lastName!: string;

  @Property()
  @Field()
  override joinedAt!: Date;

  @Property({ nullable: true, length: 2048 })
  @Field({ nullable: true })
  override avatar?: string;

  @Enum({ items: () => Role, array: true })
  override roles!: Role[];

  @Property()
  @Field()
  override isSignupCompleted!: boolean;

  @Property()
  @Field()
  override isDisabled!: boolean;

  @Property({ nullable: true })
  @Field({ nullable: true })
  disabledAt?: Date;

  @Property({ length: 5, nullable: true })
  @Field({ nullable: true })
  @Index()
  override referralCode?: string | null;

  @ManyToOne({ nullable: true })
  referredByUser?: UserEntity | null;

  @Property({ nullable: true })
  @Field({ nullable: true })
  @Index()
  override handle?: string;

  @Property({ persist: false })
  @Field()
  get fullName(): string {
    const nameParts = [this.firstName, this.lastName].filter(Boolean);
    return nameParts.join(' ');
  }

  @Property({ persist: false })
  get referredByUserId(): string | undefined {
    return this.referredByUser?.userId;
  }

  @Property({ type: 'json', nullable: true })
  @Field(() => UserPersonalizationEntity)
  override personalization!: UserPersonalizationEntity;

  constructor(props: IUserEntityConstructor) {
    const overrideProps = {
      userId: uuidv4(),
      joinedAt: new Date(),
    };
    super({
      isSignupCompleted: false,
      isDisabled: false,
      ...props,
      ...overrideProps,
    });
    this.legacyUserId = props.legacyUserId;
    this.referredByUser = props.referredByUser;
  }

  // graphql extensions
  @Field(() => UserNetworkConnectionEntity, { nullable: true })
  referredByNetworkConnection!: UserNetworkConnectionEntity;

  @Field(() => [TxEmailEntity])
  notifications!: TxEmailEntity[];

  @Field(() => [ConnectionEntity])
  connections!: ConnectionEntity[];

  @Field(() => [OptOutAddressEntity])
  optOutAddresses!: OptOutAddressEntity[];

  @Field(() => NotificationUserSettingsEntity)
  notificationSettings!: NotificationUserSettingsEntity;
}
