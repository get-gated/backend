import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import UserNetworkConnectionEntity from '../../entities/network-connection.entity';
import UserEntity from '../../entities/user.entity';

import { MarkNetworkConnectionIsGatedUserCommand } from './mark-network-connection-is-gated-user.command';

@CommandHandler(MarkNetworkConnectionIsGatedUserCommand)
export class MarkNetworkConnectionIsGatedUserCommandHandler
  implements ICommandHandler<MarkNetworkConnectionIsGatedUserCommand>
{
  constructor(
    @InjectRepository(UserNetworkConnectionEntity)
    private networkConnRepo: EntityRepository<UserNetworkConnectionEntity>,
    @InjectRepository(UserEntity)
    private userRepo: EntityRepository<UserEntity>,
  ) {}

  async execute(
    command: MarkNetworkConnectionIsGatedUserCommand,
  ): Promise<void> {
    await this.networkConnRepo.nativeUpdate(
      {
        externalIdentifier: command.emailAddress,
      },
      {
        gatedUser: this.userRepo.getReference(command.gatedUserId),
      },
    );
  }
}
