import { Entity, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import GatekeeperOptOutAddressInterface from '@app/interfaces/gatekeeper/gatekeeper-opt-out-address.interface';

type UnneededFields = Omit<
  GatekeeperOptOutAddressInterface,
  'optOutId' | 'createdAt' | 'deletedAt'
>;
interface IOptOutAddress extends UnneededFields {
  normalizedEmailAddress: string;
}

@Entity({ tableName: 'gatekeeper_opt_out_addresses' })
@ObjectType('OptOutAddress')
export default class OptOutAddressEntity
  extends GatekeeperOptOutAddressInterface
  implements GatekeeperOptOutAddressInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override optOutId!: string;

  [PrimaryKeyType]!: string;

  @Property({ index: true, type: 'uuid' })
  override userId!: string;

  @Field()
  @Property()
  override emailAddress!: string;

  @Property()
  normalizedEmailAddress: string;

  @Property()
  @Field()
  override createdAt!: Date;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override deletedAt?: Date;

  constructor(props: IOptOutAddress) {
    const overrideProps = {
      optOutId: uuidv4(),
      createdAt: new Date(),
    };
    super({ ...props, ...overrideProps });
    this.normalizedEmailAddress = props.normalizedEmailAddress;
  }
}
