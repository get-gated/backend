import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { wrap } from '@mikro-orm/core';

import PatternRepository from '../../entities/repositories/pattern.repository';

import { UpdatePatternCommand } from './update-pattern.command';

@CommandHandler(UpdatePatternCommand)
export class UpdatePatternCommandHandler
  implements ICommandHandler<UpdatePatternCommand>
{
  constructor(private patternRepo: PatternRepository) {}

  async execute(command: UpdatePatternCommand): Promise<void> {
    const pattern = await this.patternRepo.findOneOrFail(command.patternId);
    wrap(pattern).assign(command);
    await this.patternRepo.persistAndFlush(pattern);
  }
}
