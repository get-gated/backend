import { Field, InputType } from '@nestjs/graphql';

@InputType('DonationTotalFromSenderQueryInput')
export class DonationTotalFromSenderRequestDto {
  @Field({
    description: 'The domain or email address to get total donations for',
  })
  sender!: string;
}
