import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';

import { UpdateNonprofitCategoryCommand } from './update-nonprofit-category.command';

@CommandHandler(UpdateNonprofitCategoryCommand)
export class UpdateNonprofitCategoryCommandHandler
  implements ICommandHandler<UpdateNonprofitCategoryCommand>
{
  constructor(
    @InjectRepository(NonprofitCategoryEntity)
    private nonprofitCategoryRepo: EntityRepository<NonprofitCategoryEntity>,
  ) {}

  async execute(command: UpdateNonprofitCategoryCommand): Promise<void> {
    const category = await this.nonprofitCategoryRepo.findOneOrFail(
      command.nonprofitCategoryId,
    );
    wrap(category).assign(command);
    await this.nonprofitCategoryRepo.persistAndFlush(category);
  }
}
