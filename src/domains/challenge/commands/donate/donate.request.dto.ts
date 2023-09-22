import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Provider } from '@app/interfaces/payment/payment.enums';
import { Field, InputType } from '@nestjs/graphql';

import { DonateCommand } from './donate.command';

@InputType('DonateInput')
export class DonateRequestDto implements DonateCommand {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  donationRequestId!: string;

  @IsEnum(Provider)
  @IsNotEmpty()
  @Field(() => Provider)
  chargeProvider!: Provider;

  @IsNumber()
  @IsNotEmpty()
  @Field()
  amountInCents!: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  chargeToken!: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  note?: string;

  // @IsEmail()
  // @Field({ nullable: true })
  // email?: string;

  // @IsString()
  // @Field({ nullable: true })
  // name?: string;
}
