import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { TxEmailInterface } from '@app/interfaces/notification/tx-email.interface';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { v4 as uuidv4 } from 'uuid';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import { TxTemplateVariables } from '../services/tx-email/tx-email.service';

export interface ITxEmailEntity
  extends Omit<TxEmailInterface, 'txEmailId' | 'sentAt'> {
  variables: TxTemplateVariables;
  sentAt?: Date;
  uniqueId: string;
}

registerEnumType(Transaction, { name: 'TransactionEnum' });

@Entity({ tableName: 'notification_tx_emails' })
@ObjectType('TxEmail')
export default class TxEmailEntity
  extends TxEmailInterface
  implements TxEmailInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override txEmailId!: string;

  [PrimaryKeyType]!: string;

  @Index()
  @Property({ type: 'uuid', nullable: true })
  override userId?: string;

  @Index()
  @Field(() => Transaction)
  @Enum(() => Transaction)
  override transaction!: Transaction;

  @Property()
  @Field()
  override toAddress!: string;

  @Property()
  @Field()
  override toName!: string;

  @Index()
  @Property()
  @Field()
  override sentAt!: Date;

  @Property({ nullable: true }) // unique identifier to prevent the sending of the same message more than once
  @Index()
  uniqueId?: string;

  @Property({ type: 'json' })
  variables: TxTemplateVariables;

  constructor(props: ITxEmailEntity) {
    const defaultProps = {
      sentAt: new Date(),
    };
    const overrideProps = {
      txEmailId: uuidv4(),
    };
    super(Object.assign(defaultProps, props, overrideProps));
    this.variables = props.variables;
    this.uniqueId = props.uniqueId;
  }
}
