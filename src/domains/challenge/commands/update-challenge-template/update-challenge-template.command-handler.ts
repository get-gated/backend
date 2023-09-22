import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException } from '@nestjs/common';
import { wrap } from '@mikro-orm/core';

import ChallengeTemplateEntity from '../../entities/template.entity';

import { UpdateChallengeTemplateCommand } from './update-challenge-template.command';

export class ChallengeTemplateError extends BadRequestException {
  static code = 'CHALLENGE_TEMPLATE_ENABLED_MIN_NOT_MET';

  constructor() {
    super('At least one template should be enabled.');
  }
}
@CommandHandler(UpdateChallengeTemplateCommand)
export class UpdateChallengeTemplateCommandHandler
  implements ICommandHandler<UpdateChallengeTemplateCommand>
{
  constructor(
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
  ) {}

  async execute(command: UpdateChallengeTemplateCommand): Promise<void> {
    const template = await this.templateRepo.findOneOrFail(
      command.challengeTemplateId,
    );

    // need to check if there are any templates enabled
    if (!command.isEnabled) {
      const enabledTemplatesCount = await this.templateRepo.count({
        isEnabled: true,
        $ne: command.challengeTemplateId,
      });
      if (!enabledTemplatesCount) {
        // switching isEnabled to true
        throw new ChallengeTemplateError();
      }
    }

    wrap(template).assign(command);
    await this.templateRepo.persistAndFlush(template);
  }
}
