import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserInterface } from '@app/interfaces/user/user.interface';

import { UserQuery } from './queries/user/user.query';
import UserEntity from './entities/user.entity';
import { UserByHandleQuery } from './queries/user-by-handle/user-by-handle.query';

@Injectable()
export class UserAppService {
  constructor(private queryBus: QueryBus) {}

  public async queryGetUser(userId: string): Promise<UserInterface> {
    const result: UserEntity[] = await this.queryBus.execute(
      new UserQuery(userId),
    );
    return result[0];
  }

  public async queryUserByHandle(handle: string): Promise<UserInterface> {
    return this.queryBus.execute(new UserByHandleQuery(handle));
  }
}
