import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import UserRepository from '../../entities/repositories/user.repository';
import UserEntity from '../../entities/user.entity';

import { UserByHandleQuery } from './user-by-handle.query';

@QueryHandler(UserByHandleQuery)
export class UserByHandleHandler implements IQueryHandler<UserByHandleQuery> {
  constructor(private userRepository: UserRepository) {}

  async execute(query: UserByHandleQuery): Promise<UserEntity> {
    const { handle } = query;

    return this.userRepository.findOneOrFail({
      handle,
    });
  }
}
