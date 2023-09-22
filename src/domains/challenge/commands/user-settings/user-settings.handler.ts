import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { EventBusService } from '@app/modules/event-bus';
import { ChallengeUserSettingsUpdatedEvent } from '@app/events/challenge/challenge-user-settings-updated.event';
import { LoggerService } from '@app/modules/logger';
import { isUndefined, omitBy } from 'lodash';

import ChallengeConfig from '../../challenge.config';
import NonprofitEntity from '../../entities/nonprofit.entity';
import ChallengeUserSettingEntity, {
  IChallengeUserSettingEntityConstructor,
} from '../../entities/user-setting.entity';

import { UserSettingsCommand } from './user-settings.command';

@CommandHandler(UserSettingsCommand)
export class UserSettingsHandler
  implements ICommandHandler<UserSettingsCommand>
{
  constructor(
    @InjectRepository(ChallengeUserSettingEntity)
    private userSettingsRepo: EntityRepository<ChallengeUserSettingEntity>,
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
    @Inject(ChallengeConfig.KEY)
    private config: ConfigType<typeof ChallengeConfig>,
    private eventBus: EventBusService,
    private log: LoggerService,
  ) {}

  async execute(command: UserSettingsCommand): Promise<void> {
    const defaultNonprofit = await this.nonprofitRepo.findOne({
      isDefault: true,
    });
    if (!defaultNonprofit) {
      this.log.error({ command }, `missing default non-profit`);
      return;
    }
    let { nonprofitId } = defaultNonprofit;
    if (command.nonprofitId) {
      try {
        const nonprofitExists = await this.nonprofitRepo.findOne(
          command.nonprofitId,
        );
        if (nonprofitExists) {
          nonprofitId = command.nonprofitId;
        }
      } catch (error) {
        this.log.error(
          { nonprofitId: command.nonprofitId, error },
          'Error while attempting to find nonprofit, using default instead.',
        );
      }
    }

    const minimumDonation =
      command.minimumDonation || this.config.defaultMinimumDonationAmount;

    const data: IChallengeUserSettingEntityConstructor = {
      nonprofit: this.nonprofitRepo.getReference(nonprofitId),
      signature: command.signature ?? '',
      minimumDonation,
      userId: command.userId,
      injectResponses: command.injectResponses ?? true,
      nonprofitReason: command.nonprofitReason ?? '',
    };

    let entity = await this.userSettingsRepo.findOne({
      userId: command.userId,
    });
    if (entity) {
      wrap(entity).assign(omitBy(data, isUndefined));
    } else {
      entity = new ChallengeUserSettingEntity(data);
    }

    await this.userSettingsRepo.persistAndFlush(entity);
    await this.eventBus.publish(new ChallengeUserSettingsUpdatedEvent(entity));
  }
}
