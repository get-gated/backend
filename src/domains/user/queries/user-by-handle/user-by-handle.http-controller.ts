import { Controller, Get, Param } from '@nestjs/common';
import { Allow, SpecialRole } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';
import { pick } from 'lodash';

import UserEntity from '../../entities/user.entity';

import { UserByHandleQuery } from './user-by-handle.query';
import { UserByHandleResponseDto } from './user-by-handle.response.dto';

@Controller()
export class UserByHandleHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/user/:handle')
  @Allow(SpecialRole.Unauthenticated)
  async userByHandle(
    @Param('handle') handle: string,
  ): Promise<UserByHandleResponseDto> {
    const user: UserEntity = await this.queryBus.execute(
      new UserByHandleQuery(handle),
    );

    return pick(user, [
      'userId',
      'handle',
      'referralCode',
      'avatar',
      'lastName',
      'firstName',
      'fullName',
    ]);
  }
}
