import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import PatternRepository from '../../entities/repositories/pattern.repository';
import PatternEntity from '../../entities/pattern.entity';

import { AddPatternCommand } from './add-pattern.command';

@CommandHandler(AddPatternCommand)
export class AddPatternCommandHandler
  implements ICommandHandler<AddPatternCommand>
{
  constructor(private patternRepo: PatternRepository) {}

  async execute(command: AddPatternCommand): Promise<string> {
    const pattern = new PatternEntity(command);
    await this.patternRepo.persistAndFlush(pattern);
    return pattern.patternId;
  }
}
