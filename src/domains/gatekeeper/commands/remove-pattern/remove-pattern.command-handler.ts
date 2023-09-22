import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import PatternRepository from '../../entities/repositories/pattern.repository';

import { RemovePatternCommand } from './remove-pattern.command';

@CommandHandler(RemovePatternCommand)
export class RemovePatternCommandHandler
  implements ICommandHandler<RemovePatternCommand>
{
  constructor(private patternRepo: PatternRepository) {}

  async execute(command: RemovePatternCommand): Promise<void> {
    const pattern = await this.patternRepo.findOneOrFail(command.patternId);
    pattern.deletedAt = new Date();
    await this.patternRepo.persistAndFlush(pattern);
  }
}
