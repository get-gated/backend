import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeTemplateEntity from '../../entities/template.entity';

import { AddChallengeTemplateCommand } from './add-challenge-template.command';

@CommandHandler(AddChallengeTemplateCommand)
export class AddChallengeTemplateCommandHandler
  implements ICommandHandler<AddChallengeTemplateCommand>
{
  constructor(
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
  ) {}

  async execute(command: AddChallengeTemplateCommand): Promise<string> {
    const template = new ChallengeTemplateEntity({
      ...command,
    });
    await this.templateRepo.persistAndFlush(template);
    return template.challengeTemplateId;
  }
}
