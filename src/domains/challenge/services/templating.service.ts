import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UtilsService } from '@app/modules/utils';
import { ConfigType } from '@nestjs/config';

import ChallengeTemplateEntity from '../entities/template.entity';
import ChallengeUserSettingEntity from '../entities/user-setting.entity';
import ChallengeConnectionSettingEntity from '../entities/connection-setting.entity';
import ChallengeConfig from '../challenge.config';
import { TrackLinkClickedHttpController } from '../commands/track-link-clicked/track-link-clicked.http-controller';
import { TrackOpenedHttpController } from '../commands/track-opened/track-opened.http-controller';

import TemplatingBlockVariables from './templating-block-variables.class';
import TemplatingVariables from './templating-variables.class';

type Action = 'donate' | 'expected';
@Injectable()
export class TemplatingService {
  constructor(
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
    private utils: UtilsService,
    @Inject(ChallengeConfig.KEY)
    private config: ConfigType<typeof ChallengeConfig>,
  ) {}

  public async getTemplateFromRotation(): Promise<ChallengeTemplateEntity> {
    const enabledTemplates = await this.templateRepo.find(
      {
        isEnabled: true,
      },
      /* {
        cache: this.utils.timeInMs(10).mins(),
      } */
    );

    return enabledTemplates[
      Math.floor(Math.random() * enabledTemplates.length)
    ];
  }

  public populateVariables(
    template: string,
    variables: TemplatingVariables | TemplatingBlockVariables,
  ): string {
    let rendered = template;
    const properties = Object.keys(variables);

    properties.forEach((varName) => {
      rendered = rendered.replace(
        new RegExp(`%${varName}%`, 'g'),
        (variables as any)[varName],
      );
    });
    return rendered;
  }

  private getTrackableLink(url: string, challengeToken: string): string {
    const encodedUrl = encodeURI(url);
    const trackableUrl = this.utils.apiUrl(
      TrackLinkClickedHttpController.getRoute(challengeToken),
    );
    trackableUrl.searchParams.set('redirect', encodedUrl);
    return trackableUrl.toString();
  }

  public appendTrackingParametersToUrl(
    url: string,
    template: ChallengeTemplateEntity,
    connectionSettings: ChallengeConnectionSettingEntity,
    action: Action,
  ): string {
    const newUrl = new URL(url);

    newUrl.searchParams.append('template_id', template.challengeTemplateId);
    newUrl.searchParams.append(
      'template_set_by_user',
      connectionSettings.template?.challengeTemplateId ===
        template.challengeTemplateId
        ? 'true'
        : 'false',
    );
    newUrl.searchParams.append('utm_channel', 'product');
    newUrl.searchParams.append('utm_medium', 'email');
    newUrl.searchParams.append('utm_source', 'challenge');
    newUrl.searchParams.append('utm_content', action);
    newUrl.searchParams.append('utm_campaign', template.name);
    return newUrl.toString();
  }

  public getUrlWithChallengeToken(
    action: Action,
    challengeToken: string,
  ): string {
    let url;
    switch (action) {
      case 'donate':
        url = this.config.donationUrl;
        break;
      case 'expected':
        url = this.config.expectedUrl;
        break;
    }
    return url.replace(this.config.challengeTokenUrlVariable, challengeToken);
  }

  public async renderChallengeForUser(
    template: ChallengeTemplateEntity,
    userSettings: ChallengeUserSettingEntity,
    connectionSettings: ChallengeConnectionSettingEntity,
    challengeToken: string,
  ): Promise<string> {
    const blockVars = new TemplatingBlockVariables(
      connectionSettings.greetingBlock || template.greetingBlock,
      connectionSettings.leadBlock || template.leadBlock,
      connectionSettings.donateBlock || template.donateBlock,
      connectionSettings.expectedBlock || template.expectedBlock,
      connectionSettings.signatureBlock || template.signatureBlock,
    );
    let rendered = template.body;

    rendered = this.populateVariables(rendered, blockVars);

    const token = Buffer.from(challengeToken, 'utf-8').toString('base64');

    const donateUrl = this.getTrackableLink(
      this.appendTrackingParametersToUrl(
        this.getUrlWithChallengeToken('donate', token),
        template,
        connectionSettings,
        'donate',
      ),
      token,
    );

    const expectedUrl = this.getTrackableLink(
      this.appendTrackingParametersToUrl(
        this.getUrlWithChallengeToken('expected', token),
        template,
        connectionSettings,
        'expected',
      ),
      token,
    );

    const trackingPixelRoute = TrackOpenedHttpController.getRoute(token);
    const trackingPixel = this.utils.apiUrl(trackingPixelRoute).toString();

    const vars = new TemplatingVariables(
      userSettings.signature,
      userSettings.nonprofit.name,
      userSettings.minimumDonation.toString(),
      donateUrl,
      expectedUrl,
      trackingPixel,
    );

    rendered = this.populateVariables(rendered, vars);

    return rendered;
  }
}
