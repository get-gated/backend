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
import { DonationRequestType } from '@app/interfaces/challenge/challenge.enums';
import { DonationRequestInterface } from '@app/interfaces/challenge/donation-request.interface';

import { DonationsResponseDto } from '../queries/donations/donations.response.dto';
import { DonationRequestStatsResponseDto } from '../queries/donation-request-stats/donation-request-stats.response.dto';

import NonprofitEntity from './nonprofit.entity';

export interface IRequestEntityConstructor
  extends Omit<DonationRequestInterface, 'createdAt' | 'donationRequestId'> {
  nonprofit: NonprofitEntity;
}

registerEnumType(DonationRequestType, { name: 'DonationRequestTypeEnum' });

@Entity({ tableName: 'donation_requests' })
@ObjectType('DonationRequest')
export default class DonationRequestEntity
  extends DonationRequestInterface
  implements DonationRequestInterface
{
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  @Field(() => ID, { name: 'id' })
  override donationRequestId!: string;

  [PrimaryKeyType]!: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override name!: string;

  @Property({ type: 'uuid' })
  @Index()
  override userId!: string;

  @ManyToOne({ eager: true })
  @Field(() => NonprofitEntity)
  override nonprofit: NonprofitEntity;

  @Enum(() => DonationRequestType)
  @Field(() => DonationRequestType)
  override type!: DonationRequestType;

  @Property()
  @Field()
  override amountInCents!: number;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override memo!: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override thankYouMessage!: string;

  @Property()
  @Field()
  override createdAt!: Date;

  @Property({ nullable: true })
  @Field({ nullable: true })
  deletedAt?: Date;

  @Property({ nullable: true })
  @Field({ nullable: true })
  override cta?: string; // Only applies to long-living requests. label for CTAs to this request.

  @Property({ nullable: true })
  @Field({ nullable: true })
  override isFeatured?: boolean; // Only applies to long-living requests

  @Property()
  @Field()
  override isActive!: boolean;

  @Field(() => DonationsResponseDto)
  donations!: DonationsResponseDto;

  @Field({ nullable: true })
  lastDonatedAt?: Date;

  @Field(() => DonationRequestStatsResponseDto)
  stats!: DonationRequestStatsResponseDto;

  constructor(props: IRequestEntityConstructor) {
    const overrideProps = {
      donationRequestId: uuidv4(),
      createdAt: new Date(),
    };
    const defaultProps = {
      isActive: true,
    };
    super(Object.assign(defaultProps, props, overrideProps));
    this.nonprofit = props.nonprofit;
  }
}
