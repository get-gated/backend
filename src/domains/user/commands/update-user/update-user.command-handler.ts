import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { UserUpdatedEvent } from '@app/events/user/user-updated.event';
import { AuthAdapter } from '@app/modules/auth';
import { wrap } from '@mikro-orm/core';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UtilsService } from '@app/modules/utils';

import UserConfig from '../../user.config';
import UserRepository from '../../entities/repositories/user.repository';

import { UpdateUserCommand } from './update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    private userRepo: UserRepository,
    private eventBus: EventBusService,
    private auth: AuthAdapter,
    @Inject(UserConfig.KEY) private config: ConfigType<typeof UserConfig>,
    private utils: UtilsService,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const { userId, avatar } = command;
    const user = await this.userRepo.findOneOrFail(userId);

    let avatarUrl = avatar;
    if (avatar && this.utils.isBase64(avatar)) {
      const url = await this.utils.uploadFile(
        avatar,
        userId,
        this.config.avatarBucket,
      );
      avatarUrl = `${url}?${new Date().getTime()}`;
    }
    wrap(user).assign({ ...command, avatar: avatarUrl });
    await this.auth.updateUser(user);
    await this.userRepo.persistAndFlush(user);
    await this.eventBus.publish(new UserUpdatedEvent(user));
  }
}
