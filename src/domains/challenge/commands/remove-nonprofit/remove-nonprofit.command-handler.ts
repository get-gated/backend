import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException } from '@nestjs/common';

import NonprofitEntity from '../../entities/nonprofit.entity';
import ChallengeUserSettingEntity from '../../entities/user-setting.entity';

import { RemoveNonprofitCommand } from './remove-nonprofit.command';

export class NonprofitInUseError extends BadRequestException {
  static code = 'NONPROFIT_IN_USE';

  constructor() {
    super('Non profit is in use by users. Can not remove.');
  }
}

@CommandHandler(RemoveNonprofitCommand)
export class RemoveNonprofitCommandHandler
  implements ICommandHandler<RemoveNonprofitCommand>
{
  constructor(
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
    @InjectRepository(ChallengeUserSettingEntity)
    private userSettingsRepo: EntityRepository<ChallengeUserSettingEntity>,
  ) {}

  async execute(command: RemoveNonprofitCommand): Promise<void> {
    const inUse =
      (await this.userSettingsRepo.count({
        nonprofit: this.nonprofitRepo.getReference(command.nonprofitId),
      })) > 0;

    if (inUse) {
      throw new NonprofitInUseError();
    }

    await this.nonprofitRepo.nativeDelete({ nonprofitId: command.nonprofitId });
  }
}
