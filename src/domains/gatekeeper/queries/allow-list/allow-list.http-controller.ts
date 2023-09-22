import { Controller, Get, Res, StreamableFile } from '@nestjs/common';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';
import type { Response } from 'express';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';

import TrainingEntity from '../../entities/training.entity';

import { AllowListQuery } from './allow-list.query';

interface AllowListResponse {
  username: string;

  domain: string;

  rule: Rule;

  origin: TrainingOrigin;

  createdAt: string;

  id: string;
}

@Controller()
export class AllowListHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/allow-list')
  @Allow(Role.User)
  async userByHandle(
    @User() { userId }: AuthedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const allowList: TrainingEntity[] = await this.queryBus.execute(
      new AllowListQuery(userId),
    );

    const response: AllowListResponse[] = [];

    allowList.forEach((item) => {
      response.push({
        id: item.id,
        domain: item.domain,
        username: item.username,
        rule: item.rule,
        origin: item.origin,
        createdAt: item.createdAt.toISOString(),
      });
    });

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="allow-list.json"',
    });

    return new StreamableFile(Buffer.from(JSON.stringify(response)));
  }
}
