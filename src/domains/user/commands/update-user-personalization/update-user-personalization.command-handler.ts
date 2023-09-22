import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { UserUpdatedEvent } from '@app/events/user/user-updated.event';

import UserRepository from '../../entities/repositories/user.repository';

import { UpdateUserPersonalizationCommand } from './update-user-personalization.command';

@CommandHandler(UpdateUserPersonalizationCommand)
export class UpdateUserPersonalizationCommandHandler
  implements ICommandHandler<UpdateUserPersonalizationCommand>
{
  constructor(
    private userRepo: UserRepository,
    private eventBus: EventBusService,
  ) {}

  async execute(command: UpdateUserPersonalizationCommand): Promise<void> {
    const { userId, personalization } = command;
    const user = await this.userRepo.findOneOrFail(userId);
    user.personalization = personalization;
    await this.userRepo.persistAndFlush(user);
    await this.eventBus.publish(new UserUpdatedEvent(user));
  }
}
