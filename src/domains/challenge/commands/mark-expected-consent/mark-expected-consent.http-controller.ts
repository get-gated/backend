import { CommandBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';
import { Body, Controller, Post } from '@nestjs/common';

import { MarkExpectedConsentCommand } from './mark-expected-consent.command';
import { MarkExpectedConsentRequestDto } from './mark-expected-consent.request.dto';

@Controller()
export class MarkExpectedConsentHttpController {
  static route = '/challenge/consent';

  constructor(private commandBus: CommandBus) {}

  @Post(MarkExpectedConsentHttpController.route)
  @Allow(SpecialRole.Unauthenticated)
  async challengeMarkExpected(
    @Body()
    { consentId, consentResponse }: MarkExpectedConsentRequestDto,
  ): Promise<Record<string, never>> {
    await this.commandBus.execute(
      new MarkExpectedConsentCommand(consentId, consentResponse),
    );
    return {};
  }
}
