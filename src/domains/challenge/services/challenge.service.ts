import { EntityRepository } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { EventBusService } from '@app/modules/event-bus';
import {
  ChallengeAction,
  ChallengeInteraction,
  ChallengeInteractionUserRepliedTo,
  ChallengeMode,
  ChallengeWithholdReason,
  ExpectedReason,
} from '@app/interfaces/challenge/challenge.enums';
import { UtilsService } from '@app/modules/utils';
import { ChallengeActionEvent } from '@app/events/challenge/challenge-action.event';
import { v4 as uuid, v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ChallengeInteractionEvent } from '@app/events/challenge/challenge-interaction.event';
import { PaymentInitiator } from '@app/interfaces/payment/payment.enums';
import { LoggerService } from '@app/modules/logger';
import { ConfigType } from '@nestjs/config';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

import ChallengeConfig from '../challenge.config';
import { PaymentAppService } from '../../payment/payment.app-service';
import { ServiceProviderAppService } from '../../service-provider';
import ChallengeUserSettingEntity from '../entities/user-setting.entity';
import ChallengeConnectionSettingEntity from '../entities/connection-setting.entity';
import ChallengeInteractionEntity from '../entities/challenge-interaction.entity';
import ChallengeEntity, {
  IChallengeEntityConstructor,
} from '../entities/challenge.entity';

import { TemplatingService } from './templating.service';

type IPartialChallenge = Omit<
  IChallengeEntityConstructor,
  | 'template'
  | 'nonprofit'
  | 'mode'
  | 'action'
  | 'body'
  | 'challengeId'
  | 'toNormalized'
  | 'injectResponses'
>;

@Injectable()
export class ChallengeService {
  constructor(
    private eventBus: EventBusService,
    private log: LoggerService,
    private utils: UtilsService,
    private templatingService: TemplatingService,
    private serviceProvider: ServiceProviderAppService,
    @InjectRepository(ChallengeInteractionEntity)
    private challengeInteractionRepo: EntityRepository<ChallengeInteractionEntity>,
    @InjectRepository(ChallengeConnectionSettingEntity)
    private connectionSettingRepo: EntityRepository<ChallengeConnectionSettingEntity>,
    @InjectRepository(ChallengeUserSettingEntity)
    private userSettingRepo: EntityRepository<ChallengeUserSettingEntity>,
    @InjectRepository(ChallengeEntity)
    private challengeRepo: EntityRepository<ChallengeEntity>,
    private paymentService: PaymentAppService,
    @Inject(ChallengeConfig.KEY)
    private config: ConfigType<typeof ChallengeConfig>,
  ) {}

  private async previouslyProcessed(
    challenge: IPartialChallenge,
  ): Promise<boolean> {
    const { userId, threadId, connectionId } = challenge;
    const prev = await this.challengeRepo.findOne({
      userId,
      threadId,
      connectionId,
    });

    return Boolean(prev);
  }

  private async maxChallengesPerSenderReached(
    challenge: IPartialChallenge,
  ): Promise<boolean> {
    if (!this.config.challengeLimitPerSenderInHours) return false;
    const { connectionId } = challenge;
    const since = new Date();
    since.setHours(
      since.getHours() - this.config.challengeLimitPerSenderInHours,
    );
    const existing = await this.challengeRepo.findOne({
      connectionId,
      toNormalized: this.utils.normalizeEmail(challenge.to).email,
      createdAt: { $gt: since },
    });

    return Boolean(existing);
  }

  public async processChallenge(
    challenge: IPartialChallenge,
    message: ConnectionEmailMessageInterface,
  ): Promise<void> {
    const processed = await this.previouslyProcessed(challenge);
    if (processed) return;

    const { userId, connectionId, threadId } = challenge;

    const [userSettings, connectionSettings] = await Promise.all([
      this.userSettingRepo.findOneOrFail(
        { userId },
        { populate: ['nonprofit'], cache: this.utils.timeInMs(1).mins() },
      ),
      this.connectionSettingRepo.findOneOrFail(
        { connectionId },
        { populate: ['template'], cache: this.utils.timeInMs(1).mins() },
      ),
    ]);

    const template =
      connectionSettings.template ||
      (await this.templatingService.getTemplateFromRotation());

    const challengeId = uuidv4();

    // populate the template
    const body = await this.templatingService.renderChallengeForUser(
      template,
      userSettings,
      connectionSettings,
      this.paymentService.toPaymentToken(
        PaymentInitiator.CHALLENGE_INTERACTION,
        challengeId,
      ),
    );

    // determine action
    let action = ChallengeAction.Present;
    let withholdReason;

    if (connectionSettings.mode === ChallengeMode.Disable) {
      action = ChallengeAction.Withhold;
      withholdReason = ChallengeWithholdReason.UserDisableSetting;
    } else if (await this.maxChallengesPerSenderReached(challenge)) {
      action = ChallengeAction.Withhold;
      withholdReason = ChallengeWithholdReason.RecentChallenge;
    } else if (message.calendarEvent) {
      action = ChallengeAction.Withhold;
      withholdReason = ChallengeWithholdReason.CalendarEvent;
    }

    let sentMessageId;
    if (action === ChallengeAction.Present) {
      sentMessageId = await this.serviceProvider.commandSendReply({
        connectionId,
        threadId,
        body,
        to: challenge.to,
        messageId: challenge.messageId,
      });
    }

    const newChallenge = new ChallengeEntity({
      ...challenge,
      challengeId,
      action,
      withholdReason,
      body,
      template,
      mode: connectionSettings.mode,
      nonprofit: userSettings.nonprofit,
      sentMessageId,
      toNormalized: this.utils.normalizeEmail(challenge.to).email,
      injectResponses: userSettings.injectResponses,
    });

    await this.challengeRepo.persistAndFlush(newChallenge);

    await this.eventBus.publish(
      new ChallengeActionEvent({
        ...newChallenge,
        templateId: newChallenge.templateId,
      }),
    );
  }

  public async recordInteraction(
    challengeId: string,
    interaction: ChallengeInteraction,
    paymentId?: string,
    userReplyMessageId?: string,
    paymentAmount?: number,
    userRepliedToInteraction?: ChallengeInteractionUserRepliedTo,
    personalizedNote?: string,
    expectedReason?: ExpectedReason,
    expectedReasonDescription?: string,
  ): Promise<void> {
    const challenge = await this.challengeRepo.findOne(challengeId, {
      populate: ['nonprofit'],
    });
    if (!challenge) {
      this.log.debug(
        {
          challengeId,
        },
        'Challenge not found to log interaction for',
      );
      return;
    }

    const newInteraction = new ChallengeInteractionEntity({
      challenge,
      interaction,
      paymentId,
      userReplyMessageId,
      paymentAmount,
      personalizedNote,
      expectedReasonDescription,
      expectedReason,
    });

    if (interaction === ChallengeInteraction.Expected) {
      newInteraction.expectedConsentId = uuid();
    }

    await this.challengeInteractionRepo.persistAndFlush(newInteraction);
    await this.eventBus.publish(
      new ChallengeInteractionEvent({
        ...newInteraction,
        paymentAmount,
        userRepliedToInteraction,
      }),
    );
  }
}
