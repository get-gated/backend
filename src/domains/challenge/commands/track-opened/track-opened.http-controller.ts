import {
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';
import { LoggerService } from '@app/modules/logger';

import { PaymentAppService } from '../../../payment/payment.app-service';

import { TrackOpenedCommand } from './track-opened.command';

const buffer = Buffer.alloc(42);
buffer.write(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
);

const TOKEN_PARAM = 'challengeToken';

@Controller()
export class TrackOpenedHttpController {
  constructor(
    private commandBus: CommandBus,
    private log: LoggerService,
    private paymentService: PaymentAppService,
  ) {}

  static route = `challenge/:${TOKEN_PARAM}/open.gif`;

  static getRoute(challengeToken: string): string {
    return TrackOpenedHttpController.route.replace(
      `:${TOKEN_PARAM}`,
      challengeToken,
    );
  }

  @Get(TrackOpenedHttpController.route)
  @HttpCode(200)
  @Header('Content-Type', 'image/gif')
  @Allow(SpecialRole.Unauthenticated)
  async linkClicked(
    @Param(TOKEN_PARAM) challengeToken: string,
  ): Promise<StreamableFile> {
    try {
      const token = Buffer.from(challengeToken, 'base64').toString();
      const payload = this.paymentService.fromPaymentToken(token);
      await this.commandBus.execute(
        new TrackOpenedCommand(payload.initiatorId),
      );
    } catch (error) {
      this.log.warn(
        {
          challengeToken,
          error,
        },
        'Error tracking challenge open',
      );
    }

    return new StreamableFile(buffer);
  }
}
