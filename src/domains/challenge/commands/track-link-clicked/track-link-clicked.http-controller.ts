import { Controller, Get, Param, Query, Redirect } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';
import { LoggerService } from '@app/modules/logger';

import { PaymentAppService } from '../../../payment/payment.app-service';

import { TrackLinkClickedCommand } from './track-link-clicked.command';

const TOKEN_PARAM = 'challengeToken';

@Controller()
export class TrackLinkClickedHttpController {
  constructor(
    private commandBus: CommandBus,
    private log: LoggerService,
    private paymentService: PaymentAppService,
  ) {}

  static route = `challenge/:${TOKEN_PARAM}/click`;

  static getRoute(challengeToken: string): string {
    return TrackLinkClickedHttpController.route.replace(
      `:${TOKEN_PARAM}`,
      challengeToken,
    );
  }

  @Allow(SpecialRole.Unauthenticated)
  @Redirect()
  @Get(TrackLinkClickedHttpController.route)
  async linkClicked(
    @Query('redirect') redirect: string,
    @Param(TOKEN_PARAM) challengeToken: string,
  ): Promise<{ url: string; statusCode: number }> {
    const token = Buffer.from(challengeToken, 'base64').toString();
    const payload = this.paymentService.fromPaymentToken(token);

    try {
      await this.commandBus.execute(
        new TrackLinkClickedCommand(payload.initiatorId),
      );
    } catch (error) {
      this.log.warn(
        {
          redirect,
          challengeToken,
        },
        'Error tracking challenge link click',
      );
    }

    const url = decodeURIComponent(redirect);
    return { url, statusCode: 302 };
  }
}
