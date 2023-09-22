import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeTemplateEntity from '../../entities/template.entity';

import { ToggleChallengeTemplateCommand } from './toggle-challenge-template.command';

@CommandHandler(ToggleChallengeTemplateCommand)
export class ToggleChallengeTemplateCommandHandler
  implements ICommandHandler<ToggleChallengeTemplateCommand>
{
  constructor(
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
  ) {}

  async execute(command: ToggleChallengeTemplateCommand): Promise<void> {
    const template = await this.templateRepo.findOneOrFail(
      command.challengeTemplateId,
    );

    template.isEnabled = command.isEnabled;
    await this.templateRepo.persistAndFlush(template);
  }
}
