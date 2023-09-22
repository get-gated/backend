import { Field, InputType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';
import { DonationRequestType } from '@app/interfaces/challenge/challenge.enums';

@InputType('DonationRequestsInput')
export class DonationRequestsRequestDto {
  @Field({ nullable: true })
  readonly pagination?: Pagination;

  @Field(() => DonationRequestType)
  type!: DonationRequestType;

  @Field({ nullable: true })
  isActive?: boolean;
}
