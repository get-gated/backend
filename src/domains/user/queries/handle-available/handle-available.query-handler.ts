import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import UserRepository from '../../entities/repositories/user.repository';

import { HandleAvailableQuery } from './handle-available.query';

@QueryHandler(HandleAvailableQuery)
export class HandleAvailableQueryHandler
  implements IQueryHandler<HandleAvailableQuery>
{
  constructor(private userRepository: UserRepository) {}

  async execute(query: HandleAvailableQuery): Promise<boolean> {
    const { handle } = query;
    const existing = await this.userRepository.findOne({ handle });
    return !existing;
  }
}
