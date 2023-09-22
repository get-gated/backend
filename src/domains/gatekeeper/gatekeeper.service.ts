import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';
import { ParticipantInterface } from '@app/interfaces/service-provider/participant.interface';
import { Rule, Verdict } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { Maybe, UtilsService } from '@app/modules/utils';
import { LoggerService } from '@app/modules/logger';

import { ServiceProviderAppService } from '../service-provider';

import { IDecisionEntityConstructor } from './entities/decision.entity';
import PatternRepository from './entities/repositories/pattern.repository';
import { AllowedThreadEntity } from './entities/allowed-thread.entity';
import TrainingRepository from './entities/repositories/training.repository';
import OptOutAddressEntity from './entities/opt-out-address.entity';

type VerdictMap = {
  [key in Rule]?: Verdict;
};
export type EvaluateMessageResult = Pick<
  IDecisionEntityConstructor,
  | 'verdict'
  | 'ruling'
  | 'enforcedTrainingId'
  | 'enforcedPatternId'
  | 'enforcedOptOutAddressId'
  | 'overrulingMade'
>;

type CheckReturn = Promise<Maybe<EvaluateMessageResult> | void>;

interface CheckMethod {
  (messages: ConnectionEmailMessageInterface): CheckReturn;
}

@Injectable()
export class GatekeeperService {
  constructor(
    private patternService: PatternRepository,
    @InjectRepository(AllowedThreadEntity)
    private allowedThreadRepo: EntityRepository<AllowedThreadEntity>,
    @InjectRepository(OptOutAddressEntity)
    private optOutRepo: EntityRepository<OptOutAddressEntity>,
    private trainingRepository: TrainingRepository,
    private utils: UtilsService,
    private log: LoggerService,
    private readonly serviceProvider: ServiceProviderAppService,
  ) {}

  private async checkTrainedAddresses(
    message: ConnectionEmailMessageInterface,
  ): CheckReturn {
    this.log.info({ message }, 'Checking Trained Addresses');

    const { userId, from } = message;

    const { domain: fromDomain, username: fromUsername } =
      this.utils.normalizeEmail(from.emailAddress);

    const result = await this.trainingRepository.findContactTraining(
      fromDomain,
      fromUsername,
      userId,
    );

    if (!result) return;

    const { trainingId, rule } = result;

    const verdictMap: VerdictMap = {
      ALLOW: Verdict.AddressAllowed,
      GATE: Verdict.AddressGated,
      MUTE: Verdict.AddressMuted,
    };

    const verdict = verdictMap[rule];
    if (!verdict) {
      return;
    }

    return {
      enforcedTrainingId: trainingId,
      verdict,
      ruling: rule,
    };
  }

  private async checkTrainedDomains(
    message: ConnectionEmailMessageInterface,
  ): CheckReturn {
    const { userId, from } = message;
    const { domain: fromDomain } = this.utils.normalizeEmail(from.emailAddress);
    const result = await this.trainingRepository.findDomainTraining(
      fromDomain,
      userId,
    );

    if (!result) return;

    const { trainingId, rule } = result;

    const verdictMap: VerdictMap = {
      ALLOW: Verdict.DomainAllowed,
      GATE: Verdict.DomainGated,
      MUTE: Verdict.DomainMuted,
    };

    const verdict = verdictMap[rule];
    if (!verdict) {
      return;
    }

    return {
      verdict,
      enforcedTrainingId: trainingId,
      ruling: rule,
    };
  }

  private async checkForPatternMatch(
    message: ConnectionEmailMessageInterface,
  ): CheckReturn {
    const result = await this.patternService.emailMatch(
      message.from.emailAddress,
    );
    if (!result) {
      return;
    }
    const verdictMap: VerdictMap = {
      ALLOW: Verdict.PatternAllowed,
      GATE: Verdict.PatternGated,
      MUTE: Verdict.PatternMuted,
    };
    const { patternId, rule } = result;

    const verdict = verdictMap[rule];
    if (!verdict) {
      return;
    }

    return {
      verdict,
      enforcedPatternId: patternId,
      ruling: rule,
    };
  }

  private async checkMailingList(
    message: ConnectionEmailMessageInterface,
  ): CheckReturn {
    if (!message.isMailingList) return;

    const checkAddress = await this.checkTrainedAddresses({
      ...message,
      from: message.to[0],
    });

    if (checkAddress) {
      let verdict: Verdict | undefined;
      switch (checkAddress.ruling) {
        case Rule.Allow:
          verdict = Verdict.MailingListAddressAllowed;
          break;
        case Rule.Gate:
          verdict = Verdict.MailingListAddressGated;
          break;
        case Rule.Mute:
          verdict = Verdict.MailingListAddressMuted;
          break;
      }
      if (!verdict) {
        return;
      }
      return {
        ruling: checkAddress.ruling,
        verdict,
      };
    }

    const checkDomain = await this.checkTrainedAddresses({
      ...message,
      from: message.to[0],
    });

    if (checkDomain) {
      let verdict: Verdict | undefined;
      switch (checkDomain.ruling) {
        case Rule.Allow:
          verdict = Verdict.MailingListDomainAllowed;
          break;
        case Rule.Gate:
          verdict = Verdict.MailingListDomainGated;
          break;
        case Rule.Mute:
          verdict = Verdict.MailingListDomainMuted;
          break;
      }
      if (!verdict) {
        return;
      }
      return {
        ruling: checkDomain.ruling,
        verdict,
      };
    }
  }

  private async checkThread(
    message: ConnectionEmailMessageInterface,
  ): CheckReturn {
    if (!message.threadId) return;
    const allowedThread = await this.allowedThreadRepo.findOne({
      threadId: message.threadId,
    });

    if (!allowedThread) return;

    return {
      ruling: Rule.Allow,
      verdict: Verdict.ParticipantOnAllowedThread,
    };
  }

  private async checkInvitation(
    message: ConnectionEmailMessageInterface,
  ): CheckReturn {
    const { from } = message;
    const invitationAddresses: string[] = [];

    if (
      invitationAddresses.indexOf(from.emailAddress) === -1 &&
      Boolean(message.calendarEvent) === false
    ) {
      return;
    }

    return {
      verdict: Verdict.CalendarEventAllowed,
      ruling: Rule.Allow,
    };
  }

  private async checkOptOut(
    message: ConnectionEmailMessageInterface,
  ): CheckReturn {
    const recipients = [
      ...message.to,
      ...(message.cc ?? []),
      ...(message.bcc ?? []),
    ].map((item) => this.utils.normalizeEmail(item.emailAddress).email);

    const optOut = await this.optOutRepo.findOne({
      userId: message.userId,
      normalizedEmailAddress: { $in: recipients },
      deletedAt: null,
    });

    if (!optOut) return;

    return {
      verdict: Verdict.UserOptOutAllowed,
      ruling: Rule.Allow,
      enforcedOptOutAddressId: optOut.optOutId,
    };
  }

  private async checkEventRsvp(
    message: ConnectionEmailMessageInterface,
  ): CheckReturn {
    if (!message.calendarEvent?.isUserOrganizer) return;
    return {
      verdict: Verdict.CalenderRsvpUserOrganizerAllowed,
      ruling: Rule.Allow,
    };
  }

  private async checkSentMessages(
    message: ConnectionEmailMessageInterface,
  ): CheckReturn {
    const result = await this.serviceProvider.queryHasSentTo({
      userId: message.userId,
      toEmailAddress: message.from.emailAddress,
    });
    if (!result) {
      return;
    }
    return {
      verdict: Verdict.SentAllowed,
      ruling: Rule.Allow,
    };
  }

  public async evaluateMessage(
    message: ConnectionEmailMessageInterface,
  ): Promise<EvaluateMessageResult> {
    const orderOfOperations: CheckMethod[] = [
      this.checkOptOut,
      this.checkEventRsvp,
      this.checkThread,
      this.checkTrainedAddresses,
      this.checkTrainedDomains,
      this.checkMailingList,
      this.checkInvitation,
      this.checkForPatternMatch,
      this.checkSentMessages,
    ].map((method) => method.bind(this));

    let decision: Maybe<EvaluateMessageResult>;

    for (let i = 0; i < orderOfOperations.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const result = await orderOfOperations[i](message);
      if (result) {
        decision = result;
        break;
      }
    }

    if (decision) {
      return decision;
    }

    // re-evaluate against the replyToAddresses if different than the fromAddress
    const replyToAddresses = message.replyTo
      ? this.utils.getAddressesFromParticipants(message.replyTo)
      : [];

    if (
      replyToAddresses.length &&
      !replyToAddresses.includes(message.from.emailAddress)
    ) {
      // we already asserted that there are replyToAddresses
      const newReplyTo = message.replyTo as ParticipantInterface[];
      const newFrom = newReplyTo.shift() as ParticipantInterface;

      return this.evaluateMessage({
        ...message,
        from: newFrom,
        replyTo: newReplyTo,
      });
    }

    // Gate the email
    return {
      verdict: Verdict.SenderUnknownGated,
      ruling: Rule.Gate,
    };
  }
}
