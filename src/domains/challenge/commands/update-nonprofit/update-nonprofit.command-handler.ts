import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { wrap } from '@mikro-orm/core';
import { ConfigType } from '@nestjs/config';
import { UtilsService } from '@app/modules/utils';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';
import NonprofitEntity from '../../entities/nonprofit.entity';
import ChallengeConfig from '../../challenge.config';

import { UpdateNonprofitCommand } from './update-nonprofit.command';

@CommandHandler(UpdateNonprofitCommand)
export class UpdateNonprofitCommandHandler
  implements ICommandHandler<UpdateNonprofitCommand>
{
  constructor(
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
    @InjectRepository(NonprofitCategoryEntity)
    private nonprofitCategory: EntityRepository<NonprofitCategoryEntity>,
    @Inject(ChallengeConfig.KEY)
    private config: ConfigType<typeof ChallengeConfig>,
    private utils: UtilsService,
  ) {}

  async execute(command: UpdateNonprofitCommand): Promise<void> {
    const { logo, nonprofitId } = command;
    const nonprofit = await this.nonprofitRepo.findOneOrFail(nonprofitId);
    let logoUrl = logo;
    if (logo && this.utils.isBase64(logo)) {
      const url = await this.utils.uploadFile(
        logo,
        nonprofitId,
        this.config.nonprofitLogoBucket,
      );
      logoUrl = `${url}?${new Date().getTime()}`;
    }

    const data = {
      ...command,
      logo: logoUrl,
      category: this.nonprofitCategory.getReference(command.categoryId),
    };

    wrap(nonprofit).assign(data);

    await this.nonprofitRepo.persistAndFlush(nonprofit);
  }
}
