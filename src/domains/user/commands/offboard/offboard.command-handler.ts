import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import UserNotFoundError from '@app/errors/user/user-not-found.error';
import { UserRemovedEvent } from '@app/events/user/user-removed.event';
import { AuthAdapter } from '@app/modules/auth';
import { UtilsService } from '@app/modules/utils';

import UserEntity from '../../entities/user.entity';
import UserRepository from '../../entities/repositories/user.repository';

import { OffboardCommand } from './offboard.command';

@CommandHandler(OffboardCommand)
export class OffboardCommandHandler
  implements ICommandHandler<OffboardCommand>
{
  constructor(
    private userRepo: UserRepository,
    private eventBus: EventBusService,
    private auth: AuthAdapter,
    private utils: UtilsService,
  ) {}

  async execute(command: OffboardCommand): Promise<UserEntity> {
    const { userId } = command;
    const user = await this.userRepo.findOneOrFail(userId);

    if (!user || user.isDisabled) {
      throw new UserNotFoundError();
    }

    try {
      await this.auth.deleteUser(userId);
    } catch (e) {
      if (
        (e as any).message !==
        'There is no user record corresponding to the provided identifier.'
      ) {
        throw e;
      }
    }

    user.isDisabled = true;
    user.disabledAt = new Date();
    const nonAnonymizedUser = { ...user, fullName: user.fullName };

    user.firstName = this.utils.createHash(user.firstName.toLowerCase());
    user.lastName = this.utils.createHash(user.lastName.toLowerCase());
    user.avatar = '';

    await this.userRepo.persistAndFlush(user);

    await this.eventBus.publish(
      new UserRemovedEvent({
        ...nonAnonymizedUser,
        reasonText: command.reasonText ?? '',
        experienceText: command.experienceText ?? '',
      }),
    );

    return user;
  }
}
