import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { AllowThreadReason } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import GatekeeperAllowedThreadInterface from '@app/interfaces/gatekeeper/gatekeeper-allowed-thread.interface';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

type IAllowedThreadEntityConstructor = Omit<
  GatekeeperAllowedThreadInterface,
  'allowedThreadId' | 'allowedAt'
>;

registerEnumType(AllowThreadReason, { name: 'AllowedThreadReasonEnum' });

@Entity({ tableName: 'gatekeeper_allowed_threads' })
@ObjectType('AllowedThread')
export class AllowedThreadEntity
  extends GatekeeperAllowedThreadInterface
  implements GatekeeperAllowedThreadInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override allowedThreadId!: string;

  [PrimaryKeyType]!: string;

  @Property({ type: 'uuid' })
  @Index()
  override threadId!: string;

  @Property()
  @Field()
  override allowedAt!: Date;

  @Enum(() => AllowThreadReason)
  @Field(() => AllowThreadReason)
  override reason!: AllowThreadReason;

  constructor(props: IAllowedThreadEntityConstructor) {
    const defaultProps = { allowedThreadId: uuidv4(), allowedAt: new Date() };

    super(Object.assign(defaultProps, props));
  }
}
