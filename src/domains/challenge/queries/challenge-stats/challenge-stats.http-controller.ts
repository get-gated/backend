import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeUserSettingEntity from '../../entities/user-setting.entity';
import { UserAppService } from '../../../user/user.app-service';

import { ChallengeStatsQuery } from './challenge-stats.query';

@Controller()
export class ChallengeStatsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    @InjectRepository(ChallengeUserSettingEntity)
    private settingRepo: EntityRepository<ChallengeUserSettingEntity>,
    private userService: UserAppService,
  ) {}

  @Get('challenge/stats/:handle')
  @Allow(SpecialRole.Unauthenticated)
  @Header('cache-control', 'public, no-transform, max-age=3600')
  async challengeStats(@Param('handle') handle: string): Promise<any> {
    const user = await this.userService.queryUserByHandle(handle);

    if (!user) throw new NotFoundException();

    const stats = await this.queryBus.execute(
      new ChallengeStatsQuery(user.userId),
    );
    const settings = await this.settingRepo.findOne({ userId: user.userId });

    return { ...stats, nonprofitName: settings?.nonprofit.name };
  }
}
