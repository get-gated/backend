import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { NotificationUserSettingsUpdatedEvent } from '@app/events/notification/notification-user-settings-updated.event';
import { EventBusService } from '@app/modules/event-bus';

import UserSettingsEntity from '../../entities/user-settings.entity';

import { UpdateUserSettingsCommand } from './update-user-settings.command';

@CommandHandler(UpdateUserSettingsCommand)
export class UpdateUserSettingsCommandHandler
  implements ICommandHandler<UpdateUserSettingsCommand>
{
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingRepo: EntityRepository<UserSettingsEntity>,
    private eventBus: EventBusService,
  ) {}

  async execute(command: UpdateUserSettingsCommand): Promise<void> {
    const { userId, email, disableTxEmail } = command;
    let settings = await this.userSettingRepo.findOne({
      userId,
    });
    if (settings) {
      settings.email = email;
    } else {
      settings = new UserSettingsEntity({ userId, email });
    }

    if (disableTxEmail) {
      settings.disableTxEmail = disableTxEmail;
    }

    await this.userSettingRepo.persistAndFlush(settings);
    await this.eventBus.publish(
      new NotificationUserSettingsUpdatedEvent(settings),
    );
  }
}
