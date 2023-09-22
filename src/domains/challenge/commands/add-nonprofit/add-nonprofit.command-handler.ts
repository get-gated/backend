import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UtilsService } from '@app/modules/utils';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';
import NonprofitEntity from '../../entities/nonprofit.entity';
import ChallengeConfig from '../../challenge.config';

import { AddNonprofitCommand } from './add-nonprofit.command';

@CommandHandler(AddNonprofitCommand)
export class AddNonprofitCommandHandler
  implements ICommandHandler<AddNonprofitCommand>
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

  async execute(command: AddNonprofitCommand): Promise<string> {
    const { logo } = command;

    const nonprofit = new NonprofitEntity({
      ...command,
      category: this.nonprofitCategory.getReference(command.categoryId),
    });

    let logoUrl = logo;
    if (logo && this.utils.isBase64(logo)) {
      const url = await this.utils.uploadFile(
        logo,
        nonprofit.nonprofitId,
        this.config.nonprofitLogoBucket,
      );
      logoUrl = `${url}?${new Date().getTime()}`;
      nonprofit.logo = logoUrl;
    }
    await this.nonprofitRepo.persistAndFlush(nonprofit);
    return nonprofit.nonprofitId;
  }
}
