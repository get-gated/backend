import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { DonationRequestType } from '@app/interfaces/challenge/challenge.enums';

import { RequestDonationCommand } from './request-donation.command';

@InputType('DonationRequestInput')
export class RequestDonationRequestDto
  implements Omit<RequestDonationCommand, 'userId'>
{
  @Field(() => ID, {
    description: 'Leave empty to do a create. Provide to do an update',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  id!: string;

  @Field()
  @Min(100)
  @IsNumber()
  amountInCents!: number;

  @Field()
  @IsNotEmpty()
  @Length(1, 150)
  memo!: string;

  @Field(() => DonationRequestType)
  @IsNotEmpty()
  type!: DonationRequestType;

  @Field({ nullable: true })
  allowExemptionRequest!: boolean;

  @Field({ nullable: true })
  thankYouMessage?: string;

  @Field({ nullable: true })
  nonprofitId?: string;

  @Field({ nullable: true })
  isFeatured?: boolean;

  @Field({ nullable: true })
  cta?: string;

  @Field({ nullable: true })
  name?: string;
}
