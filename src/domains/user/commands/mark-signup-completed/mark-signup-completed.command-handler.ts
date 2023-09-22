import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { UserSignupCompletedEvent } from '@app/events/user/user-signup-completed.event';

import UserRepository from '../../entities/repositories/user.repository';

import { MarkSignupCompletedCommand } from './mark-signup-completed.command';

@CommandHandler(MarkSignupCompletedCommand)
export class MarkSignupCompletedCommandHandler
  implements ICommandHandler<MarkSignupCompletedCommand>
{
  constructor(
    private userRepo: UserRepository,
    private eventBus: EventBusService,
  ) {}

  async execute(command: MarkSignupCompletedCommand): Promise<void> {
    const user = await this.userRepo.findOneOrFail(command.userId);
    if (user.isSignupCompleted) return;
    user.isSignupCompleted = true;
    await this.userRepo.persistAndFlush(user);
    await this.eventBus.publish(new UserSignupCompletedEvent(user));
  }
}
