import { Field, InputType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';

@InputType('DonationsWithoutRequestIdInput')
export class DonationsWithoutRequestIdDto {
  @Field({ nullable: true })
  readonly pagination?: Pagination;
}

@InputType('DonationsInput')
export class DonationsRequestDto extends DonationsWithoutRequestIdDto {
  @Field({ nullable: true })
  donationRequestId?: string;
}
