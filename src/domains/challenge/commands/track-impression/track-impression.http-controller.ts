import {
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, SpecialRole, User } from '@app/modules/auth';
import { LoggerService } from '@app/modules/logger';
import { ImpressionSource } from '@app/interfaces/challenge/challenge.enums';

import { TrackImpressionCommand } from './track-impression.command';

const buffer = Buffer.alloc(42);
buffer.write(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
);

const USER_ID_PARAM = 'userId';
const NONPROFIT_ID_PARAM = 'nonprofitId';
const SOURCE_PARAM = 'source';

@Controller()
export class TrackImpressionHttpController {
  constructor(private commandBus: CommandBus, private log: LoggerService) {}

  static route = `impression/:${USER_ID_PARAM}/:${NONPROFIT_ID_PARAM}/:${SOURCE_PARAM}/load.gif`;

  static getRoute(userId: string, nonprofitId: string): string {
    const populatedRoute = TrackImpressionHttpController.route.replace(
      `:${USER_ID_PARAM}`,
      userId,
    );
    return populatedRoute.replace(`:${NONPROFIT_ID_PARAM}`, nonprofitId);
  }

  @Get(TrackImpressionHttpController.route)
  @HttpCode(200)
  @Header('Content-Type', 'image/gif')
  @Allow(SpecialRole.Unauthenticated)
  async linkClicked(
    @Param(USER_ID_PARAM) userId: string,
    @Param(NONPROFIT_ID_PARAM) nonprofitId: string,
    @Param(SOURCE_PARAM) source: ImpressionSource,
    @User() user: AuthedUser,
  ): Promise<StreamableFile> {
    try {
      if (user?.userId !== userId) {
        // don't count impressions for the user

        await this.commandBus.execute(
          new TrackImpressionCommand(userId, nonprofitId, source),
        );
      }
    } catch (error) {
      this.log.warn(
        {
          userId,
          source,
          nonprofitId,
          error,
        },
        'Error tracking impression',
      );
    }

    return new StreamableFile(buffer);
  }
}
