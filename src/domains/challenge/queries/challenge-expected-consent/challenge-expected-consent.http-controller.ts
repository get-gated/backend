import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

import { ChallengeExpectedConsentQuery } from './challenge-expected-consent.query';
import { ChallengeExpectedConsentResponseDto } from './challenge-expected-consent.response.dto';
import { ChallengeExpectedConsentQueryHandlerResponse } from './challenge-expected-consent.query-handler';

@Controller()
export class ChallengeExpectedConsentHttpController {
  static route = 'challenge/consent/:consentId';

  constructor(private queryBus: QueryBus) {}

  @Get(ChallengeExpectedConsentHttpController.route)
  @Allow(SpecialRole.Unauthenticated)
  async consent(
    @Param('consentId') consentId: string,
  ): Promise<ChallengeExpectedConsentResponseDto> {
    const { consentInteraction, expectedInteraction, challenge } =
      (await this.queryBus.execute(
        new ChallengeExpectedConsentQuery(consentId),
      )) as ChallengeExpectedConsentQueryHandlerResponse;

    // TODO: consentInteraction can be nullish
    const { interaction } = consentInteraction ?? {};
    return {
      consentDeniedAt:
        interaction === ChallengeInteraction.UserExpectedConsentDenied
          ? consentInteraction.performedAt
          : undefined,
      consentGrantedAt:
        interaction === ChallengeInteraction.UserExpectedConsentGranted
          ? consentInteraction.performedAt
          : undefined,
      expectedEmailAddress: challenge.to,
      expectedInteractionAt: expectedInteraction.performedAt,
      expectedPersonalNote: expectedInteraction.personalizedNote,
      expectedReason: expectedInteraction.expectedReason,
    };
  }
}
