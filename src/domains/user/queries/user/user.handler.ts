import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import UserRepository from '../../entities/repositories/user.repository';
import UserEntity from '../../entities/user.entity';

import { UserQuery } from './user.query';

@QueryHandler(UserQuery)
export class UserHandler implements IQueryHandler<UserQuery> {
  constructor(private userRepository: UserRepository) {}

  async execute(query: UserQuery): Promise<UserEntity[]> {
    const { userIds } = query;
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    return this.userRepository.find({
      $and: [{ userId: { $in: ids } }],
    });
  }
}
