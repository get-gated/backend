import { IsBase64, IsNumber, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Provider } from '@app/interfaces/payment/payment.enums';

@InputType('PaymentChargeInput')
export class ChargeDto {
  @Field(() => Provider)
  readonly provider: Provider = Provider.STRIPE;

  @IsBase64()
  @Field()
  readonly paymentToken!: string;

  @IsString()
  @Field()
  readonly chargeToken!: string;

  @IsNumber()
  @Field()
  readonly amountCents!: number;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  readonly authenticationToken?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  readonly note?: string;
}
