import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import NonprofitEntity from '../../entities/nonprofit.entity';

import { SetDefaultNonprofitCommand } from './set-default-nonprofit.command';

@CommandHandler(SetDefaultNonprofitCommand)
export class SetDefaultNonprofitCommandHandler
  implements ICommandHandler<SetDefaultNonprofitCommand>
{
  constructor(
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  async execute(command: SetDefaultNonprofitCommand): Promise<string[]> {
    const { nonprofitId } = command;

    const defaultRecords = await this.nonprofitRepo.find({
      isDefault: true,
    });
    // eslint-disable-next-line no-param-reassign, no-return-assign
    defaultRecords.forEach((record) => (record.isDefault = false));
    // setting default to false and writing to the db
    this.nonprofitRepo.persist(defaultRecords);

    const nonprofit = await this.nonprofitRepo.findOneOrFail(nonprofitId);
    nonprofit.isDefault = true;
    this.nonprofitRepo.persist(nonprofit);
    await this.nonprofitRepo.flush();

    return [...defaultRecords.map((record) => record.nonprofitId), nonprofitId];
  }
}
