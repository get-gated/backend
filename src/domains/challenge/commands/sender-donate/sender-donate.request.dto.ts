import {
  IsBase64,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Provider } from '@app/interfaces/payment/payment.enums';
import { Field, InputType } from '@nestjs/graphql';

import { SenderDonateCommand } from './sender-donate.command';

@InputType('ChallengeSenderDonateInput')
export class SenderDonateRequestDto
  implements Omit<SenderDonateCommand, 'challengeId'>
{
  @IsBase64()
  @IsNotEmpty()
  @Field()
  paymentToken!: string;

  @IsEnum(Provider)
  @IsNotEmpty()
  @Field(() => Provider)
  chargeProvider!: Provider;

  @IsString()
  @IsNotEmpty()
  @Field()
  chargeToken!: string;

  @IsNumber()
  @IsNotEmpty()
  @Field()
  amountInCents!: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  personalizedNote!: string;
}
