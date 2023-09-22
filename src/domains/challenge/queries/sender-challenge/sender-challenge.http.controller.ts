import { Body, Controller, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';
import { ChallengeResponseInitiatedEvent } from '@app/events/challenge/challenge-response-initiated.event';
import { EventBusService } from '@app/modules/event-bus';

import { PaymentAppService } from '../../../payment/payment.app-service';
import { UserAppService } from '../../../user/user.app-service';
import { ServiceProviderAppService } from '../../../service-provider';

import { SenderChallengeRequestDto } from './sender-challenge.request.dto';
import { SenderChallengeQuery } from './sender-challenge.query';
import { ISenderChallengeQueryHandlerResponse } from './sender-challenge.query-handler';
import { SenderChallengeResponseDto } from './sender-challenge-response.dto';

@Controller()
export class SenderChallengeHttpController {
  constructor(
    private queryBus: QueryBus,
    private paymentService: PaymentAppService,
    private userService: UserAppService,
    private providerService: ServiceProviderAppService,
    private eventBus: EventBusService,
  ) {}

  static route = '/sender-challenge';

  @Post(SenderChallengeHttpController.route)
  @Allow(SpecialRole.Unauthenticated)
  async getSenderChallenge(
    @Body() { token }: SenderChallengeRequestDto,
  ): Promise<SenderChallengeResponseDto> {
    const challengeId = this.paymentService.fromPaymentToken(
      Buffer.from(token, 'base64').toString('ascii'),
    ).initiatorId;

    const {
      userSettings,
      challenge,
      hasExpected,
      hasDonation,
      nonprofit,
      donationAmountInCents,
    }: ISenderChallengeQueryHandlerResponse = await this.queryBus.execute(
      new SenderChallengeQuery(challengeId),
    );

    const { avatar, lastName, firstName, fullName, referralCode } =
      await this.userService.queryGetUser(challenge.userId);

    const isActive = await this.providerService.queryConnectionIsActive(
      challenge.connectionId,
    );

    // publish challenge response initiated event when sender-challenge is queried from the http controller, eg: website requested challenge details to present flow
    await this.eventBus.publish(
      new ChallengeResponseInitiatedEvent({
        ...challenge,
        nonprofit,
        hasDonation,
        hasExpected,
      }),
    );

    return {
      challengeId: challenge.challengeId,
      minimumDonationInCents: userSettings.minimumDonation,
      nonprofitLogo: nonprofit.logo,
      nonprofitName: nonprofit.name,
      nonprofitReason: userSettings.nonprofitReason,
      avatar,
      firstName,
      lastName,
      fullName,
      hasDonation,
      hasExpected,
      isActive,
      referralCode,
      senderEmail: challenge.to,
      donationAmountInCents,
    };
  }
}
