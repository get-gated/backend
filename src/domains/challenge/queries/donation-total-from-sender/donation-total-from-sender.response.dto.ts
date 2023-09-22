import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('DonationTotalFromSenderQueryResponse')
export class DonationTotalFromSenderResponseDto {
  @Field()
  totalAmountInCents!: number;

  @Field()
  donationsCount!: number;
}
