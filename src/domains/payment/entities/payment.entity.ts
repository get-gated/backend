import { Entity, Enum, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';
import { PaymentInterface } from '@app/interfaces/payment/payment.interface';
import {
  PaymentInitiator,
  Provider,
} from '@app/interfaces/payment/payment.enums';

export type IPaymentEntity = Omit<PaymentInterface, 'paymentId' | 'createdAt'>;

registerEnumType(Provider, { name: 'PaymentProviderEnum' });

@Entity({ tableName: 'payment' })
@ObjectType('Payment')
export default class PaymentEntity extends PaymentInterface {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override paymentId!: string;

  @Enum(() => Provider)
  @Field(() => Provider)
  override provider!: Provider;

  @Field()
  @Unique()
  @Property({
    length: 128,
    nullable: true,
  })
  override externalId?: string;

  @Property()
  @Field()
  override amountCents!: number;

  @Enum(() => PaymentInitiator)
  override initiator!: PaymentInitiator;

  @Property()
  override initiatorId!: string;

  @Property({ nullable: true, columnType: 'text' })
  @Field({ nullable: true })
  override note?: string;

  @Property()
  override createdAt!: Date;

  constructor(props: IPaymentEntity) {
    const overrideProps = {
      paymentId: uuidv4(),
      createdAt: new Date(),
    };
    super({ ...props, ...overrideProps });
  }
}
