import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { UserUpdatedEvent } from '@app/events/user/user-updated.event';
import { BadRequestException, ConflictException } from '@nestjs/common';

import UserRepository from '../../entities/repositories/user.repository';

import { HandleCommand } from './handle.command';

@CommandHandler(HandleCommand)
export class HandleCommandHandler implements ICommandHandler<HandleCommand> {
  constructor(
    private userRepo: UserRepository,
    private eventBus: EventBusService,
  ) {}

  async execute(command: HandleCommand): Promise<void> {
    const { userId, handle } = command;

    const inUse = await this.userRepo.findOne({ handle });

    if (inUse) {
      throw new ConflictException('Handle in use');
    }

    const user = await this.userRepo.findOneOrFail(userId);

    if (user.handle) {
      // don't allow updating of handles right now until we can deal with redirects
      throw new BadRequestException('Handle already set for user');
    }

    user.handle = handle;

    await this.userRepo.persistAndFlush(user);
    await this.eventBus.publish(new UserUpdatedEvent(user));
  }
}
