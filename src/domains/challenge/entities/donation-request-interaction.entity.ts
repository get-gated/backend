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
import { DonationRequestInteractionInterface } from '@app/interfaces/challenge/donation-request-interaction.interface';
import { DonationRequestInteraction } from '@app/interfaces/challenge/challenge.enums';

import DonationRequestEntity from './donation-request.entity';

type IRequestDonationEntityConstructor = Omit<
  DonationRequestInteractionInterface,
  'donationRequestInteractionId' | 'performedAt'
>;

registerEnumType(DonationRequestInteraction, {
  name: 'DonationRequestInteractionEnum',
});

@Entity({ tableName: 'donation_request_interactions' })
@ObjectType('DonationRequestInteraction')
export default class DonationRequestInteractionEntity
  extends DonationRequestInteractionInterface
  implements DonationRequestInteractionInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override donationRequestInteractionId!: string;

  [PrimaryKeyType]!: string;

  @ManyToOne(() => DonationRequestEntity)
  @Field(() => DonationRequestEntity)
  override request!: DonationRequestEntity;

  @Enum(() => DonationRequestInteraction)
  @Field(() => DonationRequestInteraction)
  @Index()
  override interaction!: DonationRequestInteraction;

  @Property({ type: 'uuid', nullable: true }) // only applicable if type is Donated
  override paymentId!: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override amountInCents!: number; // only applicable if type is Donated

  @Property({ nullable: true, columnType: 'text' })
  @Field({ nullable: true })
  override note!: string;

  @Property()
  @Field()
  override performedAt!: Date;

  constructor(props: IRequestDonationEntityConstructor) {
    const defaultProps = {
      donationRequestInteractionId: uuidv4(),
    };

    const overrideProps = {
      performedAt: new Date(),
    };
    super(Object.assign(defaultProps, props, overrideProps));
  }
}
