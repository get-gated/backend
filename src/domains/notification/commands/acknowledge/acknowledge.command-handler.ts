import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import UserSettingsEntity from '../../entities/user-settings.entity';

import { AcknowledgeCommand } from './acknowledge.command';

@CommandHandler(AcknowledgeCommand)
export class AcknowledgeCommandHandler
  implements ICommandHandler<AcknowledgeCommand>
{
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingRepo: EntityRepository<UserSettingsEntity>,
  ) {}

  async execute(command: AcknowledgeCommand): Promise<any> {
    const { userId } = command;
    await this.userSettingRepo.nativeUpdate({ userId }, { unread: 0 });
  }
}
