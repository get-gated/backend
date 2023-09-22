import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { UserUpdatedEvent } from '@app/events/user/user-updated.event';
import { AuthAdapter } from '@app/modules/auth';

import UserRepository from '../../entities/repositories/user.repository';

import { UpdateUserRolesCommand } from './update-user-roles.command';

@CommandHandler(UpdateUserRolesCommand)
export class UpdateUserRolesCommandHandler
  implements ICommandHandler<UpdateUserRolesCommand>
{
  constructor(
    private userRepo: UserRepository,
    private eventBus: EventBusService,
    private auth: AuthAdapter,
  ) {}

  async execute(command: UpdateUserRolesCommand): Promise<void> {
    const { userId, roles } = command;
    const user = await this.userRepo.findOneOrFail(userId);
    user.roles = roles;
    await this.auth.updateUser(user);
    await this.userRepo.persistAndFlush(user);
    await this.eventBus.publish(new UserUpdatedEvent(user));
  }
}
