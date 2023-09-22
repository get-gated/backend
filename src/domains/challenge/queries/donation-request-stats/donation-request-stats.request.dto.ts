import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType('DonationRequestStatsInput')
export class DonationRequestStatsRequestDto {
  @Field({
    nullable: true,
    description: 'If not provided, user-wide stats are returned',
  })
  @IsUUID()
  @IsOptional()
  donationRequestId?: string;
}
