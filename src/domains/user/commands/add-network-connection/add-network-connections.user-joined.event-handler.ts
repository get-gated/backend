import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UserJoinedEvent } from '@app/events/user/user-joined.event';
import { CommandBus } from '@nestjs/cqrs';
import { LoggerService } from '@app/modules/logger';

import UserRepository from '../../entities/repositories/user.repository';
import { NotificationAppService } from '../../../notification/notification.app-service';

import { AddNetworkConnectionCommand } from './add-network-connection.command';

@EventHandler(UserJoinedEvent, 'add-network-connection')
export class AddNetworkConnectionsUserJoinedEventHandler
  implements IEventHandler<UserJoinedEvent>
{
  constructor(
    private commandBus: CommandBus,
    private userRepository: UserRepository,
    private log: LoggerService,
    private notificationService: NotificationAppService,
  ) {}

  async handler(event: UserJoinedEvent): Promise<void> {
    if (!event.referredByUserId) return;

    // add new user as network connection to whomever referred them
    await this.commandBus.execute(
      new AddNetworkConnectionCommand(
        event.referredByUserId,
        event.joinedWithEmail,
        event.fullName,
        event.avatar,
        false,
        event.userId,
      ),
    );

    // add referring user as network connection to the user that joined
    const referringUser = await this.userRepository.findOne(
      event.referredByUserId,
    );
    if (!referringUser) {
      return this.log.warn({ event }, 'Could not find referring user');
    }
    const { email } = await this.notificationService.queryUserSettings({
      userId: referringUser.userId,
    });

    await this.commandBus.execute(
      new AddNetworkConnectionCommand(
        event.userId,
        email,
        referringUser.fullName,
        referringUser.avatar,
        false,
        referringUser.userId,
      ),
    );
  }
}
