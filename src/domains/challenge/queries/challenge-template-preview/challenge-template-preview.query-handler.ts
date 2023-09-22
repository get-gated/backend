import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeConnectionSettingEntity from '../../entities/connection-setting.entity';
import ChallengeUserSettingEntity from '../../entities/user-setting.entity';
import { TemplatingService } from '../../services/templating.service';
import ChallengeTemplateEntity from '../../entities/template.entity';

import { ChallengeTemplatePreviewQuery } from './challenge-template-preview.query';

@QueryHandler(ChallengeTemplatePreviewQuery)
export class ChallengeTemplatePreviewQueryHandler
  implements IQueryHandler<ChallengeTemplatePreviewQuery>
{
  constructor(
    @InjectRepository(ChallengeUserSettingEntity)
    private userSettingsRepo: EntityRepository<ChallengeUserSettingEntity>,
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
    private templatingService: TemplatingService,
  ) {}

  async execute(query: ChallengeTemplatePreviewQuery): Promise<string> {
    const { userId } = query;
    const userSettings = await this.userSettingsRepo.findOneOrFail({ userId });
    const previewConnectionSettings = new ChallengeConnectionSettingEntity({
      ...query,
      userId,
    });
    const template = await this.templateRepo.findOneOrFail(query.templateId);
    return this.templatingService.renderChallengeForUser(
      template,
      userSettings,
      previewConnectionSettings,
      'preview',
    );
  }
}
