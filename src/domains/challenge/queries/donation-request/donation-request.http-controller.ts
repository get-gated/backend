import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';

import { DonationRequestQuery } from './donation-request.query';
import { DonationRequestResponseDto } from './donation-request.response.dto';
import { DonationRequestQueryHandlerResponse } from './donation-request.query-handler';

@Controller()
export class DonationRequestHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/donation-request/:requestId')
  @Allow(SpecialRole.Unauthenticated)
  async donationRequest(
    @Param('requestId') requestId: string,
  ): Promise<DonationRequestResponseDto> {
    const { request, donatedInteraction }: DonationRequestQueryHandlerResponse =
      await this.queryBus.execute(new DonationRequestQuery(requestId));

    return {
      memo: request.memo,
      amountInCents: request.amountInCents,
      createdAt: request.createdAt,
      isCompleted: Boolean(donatedInteraction),
      completedAt: donatedInteraction?.performedAt,
      nonprofitName: request.nonprofit.name,
      allowExemptionRequest: request.allowExemptionRequest,
      thankYouMessage: request.thankYouMessage,
      donationRequestId: request.donationRequestId,
      type: request.type,
      userId: request.userId,
    };
  }
}
