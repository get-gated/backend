import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ChallengeConnectionSettingsUpdatedEvent } from '@app/events/challenge/challenge-connection-settings-updated.event';
import { EventBusService } from '@app/modules/event-bus';

import ChallengeTemplateEntity from '../../entities/template.entity';
import ChallengeConnectionSettingEntity from '../../entities/connection-setting.entity';

import { ConnectionSettingsCommand } from './connection-settings.command';

@CommandHandler(ConnectionSettingsCommand)
export class ConnectionSettingsCommandHandler
  implements ICommandHandler<ConnectionSettingsCommand>
{
  constructor(
    @InjectRepository(ChallengeConnectionSettingEntity)
    private settingRepo: EntityRepository<ChallengeConnectionSettingEntity>,
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
    private eventBus: EventBusService,
  ) {}

  async execute(
    command: ConnectionSettingsCommand,
  ): Promise<ChallengeConnectionSettingEntity> {
    let setting = await this.settingRepo.findOne({
      connectionId: command.connectionId,
      userId: command.userId,
    });

    const data = {
      ...command,
      template: command.templateId
        ? this.templateRepo.getReference(command.templateId)
        : undefined,
    };

    if (setting) {
      wrap(setting).assign({ ...data, updatedAt: new Date() });
    } else {
      setting = new ChallengeConnectionSettingEntity(data);
    }

    await this.settingRepo.persistAndFlush(setting);
    await this.eventBus.publish(
      new ChallengeConnectionSettingsUpdatedEvent(setting),
    );
    return setting;
  }
}
