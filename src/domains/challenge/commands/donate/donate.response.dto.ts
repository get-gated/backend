import { Field, ObjectType } from '@nestjs/graphql';

import DonationRequestInteractionEntity from '../../entities/donation-request-interaction.entity';

@ObjectType('DonateResponse')
export class DonateResponseDto {
  @Field(() => DonationRequestInteractionEntity)
  donatedInteraction!: DonationRequestInteractionEntity;

  @Field({ nullable: true })
  thankYouMessage!: string;
}
