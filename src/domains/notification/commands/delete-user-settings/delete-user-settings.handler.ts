import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import UserSettingsEntity from '../../entities/user-settings.entity';

import { DeleteUserSettingsCommand } from './delete-user-settings.command';

@CommandHandler(DeleteUserSettingsCommand)
export class DeleteUserSettingsCommandHandler
  implements ICommandHandler<DeleteUserSettingsCommand>
{
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingRepo: EntityRepository<UserSettingsEntity>,
  ) {}

  async execute({ userId }: DeleteUserSettingsCommand): Promise<void> {
    const settings = await this.userSettingRepo.findOne({
      userId,
    });
    if (!settings || settings.deletedAt) {
      return;
    }
    settings.deletedAt = new Date();
    await this.userSettingRepo.persistAndFlush(settings);
  }
}
