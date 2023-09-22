import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from '@app/modules/utils';
import { getRepositoryToken } from '@mikro-orm/nestjs';

import ChallengeConnectionSettingEntity from '../entities/connection-setting.entity';
import ChallengeUserSettingEntity from '../entities/user-setting.entity';
import ChallengeTemplateEntity from '../entities/template.entity';
import AppConfig from '../../../app.config';
import { TrackLinkClickedHttpController } from '../commands/track-link-clicked/track-link-clicked.http-controller';
import { TrackOpenedHttpController } from '../commands/track-opened/track-opened.http-controller';
import ChallengeConfig from '../challenge.config';

import TemplatingBlockVariablesClass from './templating-block-variables.class';
import TemplatingVariablesClass from './templating-variables.class';
import { TemplatingService } from './templating.service';

const utilsMock = {};
const templateRepoMock = {};
const connectionSettingsRepoMock = {
  findOne: jest.fn(),
};
const userSettingsRepoMock = {
  findOne: jest.fn(),
};
const appConfigMock = { public: {} };
const challengeConfigMock = {
  challengeTokenUrlVariable: ':token',
  donationUrl: 'https://app.gated.com/challenge/:token/donate',
  expectedUrl: 'https://app.gated.com/challenge/:token/expected',
};
const controllerMock = { getRoute: jest.fn() };

describe('TemplatingService', () => {
  let service: TemplatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatingService,
        { provide: UtilsService, useValue: utilsMock },
        {
          provide: getRepositoryToken(ChallengeTemplateEntity),
          useValue: templateRepoMock,
        },
        {
          provide: getRepositoryToken(ChallengeConnectionSettingEntity),
          useValue: connectionSettingsRepoMock,
        },
        {
          provide: getRepositoryToken(ChallengeUserSettingEntity),
          useValue: userSettingsRepoMock,
        },
        { provide: AppConfig.KEY, useValue: appConfigMock },
        { provide: ChallengeConfig.KEY, useValue: challengeConfigMock },
        { provide: TrackLinkClickedHttpController, useValue: controllerMock },
        { provide: TrackOpenedHttpController, useValue: controllerMock },
      ],
    }).compile();

    service = module.get<TemplatingService>(TemplatingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('populateVariables', () => {
    it('should populate templating variables', () => {
      const vars = new TemplatingVariablesClass(
        'Test User',
        'My Nonprofit',
        200,
        'donate.com',
        'expected.com',
        'tracking.com',
      );
      const varTemplate =
        'This is is a test template. Please donate %donation_minimum% to %nonprofit_name% at this link %link_donate%. Expected? %link_expected%. Thanks! %signature% %tracking_pixel%';
      const expectedResult = `This is is a test template. Please donate ${vars.donation_minimum} to ${vars.nonprofit_name} at this link ${vars.link_donate}. Expected? ${vars.link_expected}. Thanks! ${vars.signature} ${vars.tracking_pixel}`;
      const rendered = service.populateVariables(varTemplate, vars);
      expect(rendered).toEqual(expectedResult);
    });

    it('should populate block variables', () => {
      const blockVars = new TemplatingBlockVariablesClass(
        'Hey how are you?',
        'This is my lead...',
        'Please make a donation!',
        'Unless I am expecting your message',
        'Toodaloo!',
      );
      const blockTemplate =
        'This is the greeting %block_greeting%. This is the lead: %block_lead%. this is the donate: %block_donate%. This is expected: %block_expected%. This is the signature: %block_signature%.';
      const expectedResult = `This is the greeting ${blockVars.block_greeting}. This is the lead: ${blockVars.block_lead}. this is the donate: ${blockVars.block_donate}. This is expected: ${blockVars.block_expected}. This is the signature: ${blockVars.block_signature}.`;
      const rendered = service.populateVariables(blockTemplate, blockVars);
      expect(rendered).toEqual(expectedResult);
    });

    it('should populate variables in block variables', () => {
      const blockVars = new TemplatingBlockVariablesClass(
        'Hey how are you?',
        'This is my lead...',
        'Please make a <a href="%link_donate%">donation</a> to %nonprofit_name% of %donation_minimum%!',
        'Unless I am expecting your message <a href="%link_expected%">click here</a>',
        'Toodaloo! Sincerely %signature% %tracking_pixel%',
      );
      const blockTemplate =
        'This is the greeting %block_greeting%. This is the lead: %block_lead%. this is the donate: %block_donate%. This is expected: %block_expected%. This is the signature: %block_signature%.';
      const signature = 'Test User';
      const nonprofitName = 'My Nonprofit';
      const minimumDonationAmount = 200;
      const donateLink = 'donate.com';
      const expectedLink = 'expected.com';
      const trackingPixel = 'tracking.com';

      const vars = new TemplatingVariablesClass(
        signature,
        nonprofitName,
        minimumDonationAmount,
        donateLink,
        expectedLink,
        trackingPixel,
      );

      const expectedDonate = `Please make a <a href="${vars.link_donate}">donation</a> to ${vars.nonprofit_name} of ${vars.donation_minimum}!`;
      const expectedSignature = `Toodaloo! Sincerely ${vars.signature} ${vars.tracking_pixel}`;
      const expectedExpected = `Unless I am expecting your message <a href="${vars.link_expected}">click here</a>`;
      const expectedResult = `This is the greeting ${blockVars.block_greeting}. This is the lead: ${blockVars.block_lead}. this is the donate: ${expectedDonate}. This is expected: ${expectedExpected}. This is the signature: ${expectedSignature}.`;

      let rendered = service.populateVariables(blockTemplate, blockVars);
      rendered = service.populateVariables(rendered, vars);
      expect(rendered).toEqual(expectedResult);
    });

    it('should populate multiple instances of variables', () => {
      const vars = new TemplatingVariablesClass(
        'Test User',
        'My Nonprofit',
        200,
        'donate.com',
        'expected.com',
        'tracking.com',
      );
      const varTemplate =
        '%donation_minimum% %nonprofit_name% %signature% %nonprofit_name% %signature% %donation_minimum%';

      const rendered = service.populateVariables(varTemplate, vars);
      expect(rendered.includes('%')).toEqual(false);
    });
  });

  describe('getUrlWithChallengeToken', () => {
    it('should replace the token variable', () => {
      const token = 'my-challenge-token';
      const url = service.getUrlWithChallengeToken('donate', token);
      expect(url).not.toContain(challengeConfigMock.challengeTokenUrlVariable);
      expect(url).toContain(token);
    });

    it('should return a donate url', () => {
      const url = service.getUrlWithChallengeToken(
        'donate',
        challengeConfigMock.challengeTokenUrlVariable,
      );
      expect(url).toEqual(challengeConfigMock.donationUrl);
    });

    it('should return a expected url', () => {
      const url = service.getUrlWithChallengeToken(
        'expected',
        challengeConfigMock.challengeTokenUrlVariable,
      );
      expect(url).toEqual(challengeConfigMock.expectedUrl);
    });
  });

  describe('appendTrackingParametersToUrl', () => {
    const url = 'https://test.com/challenge/xyz/donate';
    const template = {
      challengeTemplateId: '123',
      name: 'test template',
    } as ChallengeTemplateEntity;

    const connectionSettings = {
      template: { challengeTemplateId: '123' },
    } as ChallengeConnectionSettingEntity;

    const action = 'donate';

    it('should append all basic params', () => {
      const paramedUrl = service.appendTrackingParametersToUrl(
        url,
        template,
        connectionSettings,
        action,
      );

      const urlParts = new URL(paramedUrl);

      expect(urlParts.searchParams.get('template_id')).toEqual(
        template.challengeTemplateId,
      );

      expect(urlParts.searchParams.get('utm_channel')).toEqual('product');
      expect(urlParts.searchParams.get('utm_medium')).toEqual('email');
      expect(urlParts.searchParams.get('utm_source')).toEqual('challenge');
      expect(urlParts.searchParams.get('utm_content')).toEqual(action);
      expect(urlParts.searchParams.get('utm_campaign')).toEqual(template.name);
    });

    it('should specify when its the users chosen template', () => {
      const paramedUrl = service.appendTrackingParametersToUrl(
        url,
        template,
        connectionSettings,
        action,
      );

      const urlParts = new URL(paramedUrl);

      expect(urlParts.searchParams.get('template_set_by_user')).toEqual('true');
    });

    it('should specify when its not the users chosen template', () => {
      const connectionSettingsWithoutTemplate = {
        template: null,
      } as unknown as ChallengeConnectionSettingEntity;

      const paramedUrl = service.appendTrackingParametersToUrl(
        url,
        template,
        connectionSettingsWithoutTemplate,
        action,
      );

      const urlParts = new URL(paramedUrl);

      expect(urlParts.searchParams.get('template_set_by_user')).toEqual(
        'false',
      );
    });
  });
});
