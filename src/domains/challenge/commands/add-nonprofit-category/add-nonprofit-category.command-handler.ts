import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';

import { AddNonprofitCategoryCommand } from './add-nonprofit-category.command';

@CommandHandler(AddNonprofitCategoryCommand)
export class AddNonprofitCategoryCommandHandler
  implements ICommandHandler<AddNonprofitCategoryCommand>
{
  constructor(
    @InjectRepository(NonprofitCategoryEntity)
    private nonprofitCategoryRepo: EntityRepository<NonprofitCategoryEntity>,
  ) {}

  async execute(command: AddNonprofitCategoryCommand): Promise<string> {
    const category = new NonprofitCategoryEntity(command);
    await this.nonprofitCategoryRepo.persistAndFlush(category);
    return category.nonprofitCategoryId;
  }
}
