import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException } from '@nestjs/common';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';
import NonprofitEntity from '../../entities/nonprofit.entity';

import { RemoveNonprofitCategoryCommand } from './remove-nonprofit-category.command';

export class NonprofitCategoryInUseError extends BadRequestException {
  static code = 'NONPROFIT_CATEGORY_IN_USE';

  constructor() {
    super('Nonprofit Category in use by nonprofits. Can not remove.');
  }
}

@CommandHandler(RemoveNonprofitCategoryCommand)
export class RemoveNonprofitCategoryCommandHandler
  implements ICommandHandler<RemoveNonprofitCategoryCommand>
{
  constructor(
    @InjectRepository(NonprofitCategoryEntity)
    private nonprofitCategoryRepo: EntityRepository<NonprofitCategoryEntity>,
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  async execute(command: RemoveNonprofitCategoryCommand): Promise<void> {
    const inUse =
      (await this.nonprofitRepo.count({
        category: this.nonprofitCategoryRepo.getReference(
          command.nonprofitCategoryId,
        ),
      })) > 0;

    if (inUse) {
      throw new NonprofitCategoryInUseError();
    }
    await this.nonprofitCategoryRepo.nativeDelete(command.nonprofitCategoryId);
  }
}
