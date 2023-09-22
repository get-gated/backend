import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { NotificationUserSettingInterface } from '@app/interfaces/notification/user-setting.interface';
import { v4 as uuidv4 } from 'uuid';
import { Extensions, Field, ID, ObjectType } from '@nestjs/graphql';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { Role } from '@app/modules/auth';

type IUserSettingsEntityConstructor = Omit<
  NotificationUserSettingInterface,
  'userSettingId' | 'updatedAt'
>;
@Entity({ tableName: 'notification_user_settings' })
@ObjectType('NotificationUserSettings')
export default class UserSettingsEntity
  extends NotificationUserSettingInterface
  implements NotificationUserSettingInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override userSettingId!: string;

  [PrimaryKeyType]!: string;

  @Index()
  @Property({ type: 'uuid' })
  override userId!: string;

  @Property()
  @Field()
  override email!: string;

  @Property()
  @Field()
  updatedAt!: Date;

  @Property()
  @Field()
  unread!: number;

  @Property()
  @Field({ nullable: true })
  deletedAt?: Date | null;

  @Enum({ items: () => Transaction, nullable: true, array: true })
  @Field(() => [Transaction], { nullable: true })
  @Extensions({ allow: Role.Admin })
  disableTxEmail?: Transaction[];

  constructor(props: IUserSettingsEntityConstructor) {
    const overrideProps = {
      userSettingId: uuidv4(),
    };
    super({ ...props, ...overrideProps });
    this.updatedAt = new Date();
  }

  @Property({ persist: false })
  get isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
