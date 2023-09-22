import { Entity, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import GatekeeperUserSettingsInterface from '@app/interfaces/gatekeeper/gatekeeper-user-settings.interface';

type GatekeeperUserSettingConstructor = Omit<
  GatekeeperUserSettingsInterface,
  'userSettingId' | 'updatedAt'
>;

@Entity({ tableName: 'gatekeeper_user_settings' })
@ObjectType('GatekeeperUserSetting')
export default class GatekeeperUserSetting
  extends GatekeeperUserSettingsInterface
  implements GatekeeperUserSettingsInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override userSettingId!: string;

  [PrimaryKeyType]!: string;

  @Property({ index: true, type: 'uuid' })
  override userId!: string;

  @Field()
  @Property()
  override isInjectDecisionsEnabled!: boolean;

  @Property()
  @Field()
  override updatedAt!: Date;

  constructor(props: GatekeeperUserSettingConstructor) {
    const overrideProps = {
      userSettingId: uuidv4(),
      updatedAt: new Date(),
    };
    super({ ...props, ...overrideProps });
  }
}
