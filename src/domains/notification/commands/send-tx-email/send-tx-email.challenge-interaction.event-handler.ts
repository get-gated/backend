/* eslint-disable no-await-in-loop */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { CommandBus } from '@nestjs/cqrs';
import { ChallengeInteractionEvent } from '@app/events/challenge/challenge-interaction.event';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { LoggerService } from '@app/modules/logger';

import TxEmailEntity from '../../entities/tx-email.entity';
import {
  TxEmailService,
  TxTemplateVariables,
} from '../../services/tx-email/tx-email.service';

import SendTxEmailCommand from './send-tx-email.command';

@EventHandler(ChallengeInteractionEvent, 'notification-send-tx-email')
@Injectable()
export default class SendTxEmailChallengeInteractionEventHandler
  implements IEventHandler<ChallengeInteractionEvent>
{
  constructor(
    private commandBus: CommandBus,
    private txEmailService: TxEmailService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private log: LoggerService,
    @InjectRepository(TxEmailEntity)
    private emailRepo: EntityRepository<TxEmailEntity>,
  ) {}

  async handler(event: ChallengeInteractionEvent): Promise<void> {
    const { interaction, challenge, paymentId, challengeInteractionId } = event;
    const { userId } = challenge;

    // prevent duplicate processing;
    const cacheKey = `tx-email-interaction-subscriber-${event.challengeInteractionId}`;
    const exists = await this.cache.get(cacheKey);
    if (exists) {
      this.log.warn(
        { challengeInteractionId: event.challengeInteractionId },
        'Currently processing interaction with this ID. Ignoring.',
      );
      return;
    }
    await this.cache.set(cacheKey, true, { ttl: 2 });
    const releaseCache = (): Promise<any> => this.cache.del(cacheKey);

    try {
      const handledInteractions = [
        ChallengeInteraction.Donated,
        ChallengeInteraction.Expected,
      ];

      if (!handledInteractions.includes(interaction)) return;

      const variables: TxTemplateVariables = {
        ...(await this.txEmailService.getVariables({ userId, paymentId })),
        nonprofitName: challenge.nonprofit.name,
        nonprofitSlug: challenge.nonprofit.slug,
        senderEmailAddress: challenge.to,
        senderPersonalizedNote: event.personalizedNote,
        challengeExpectedConsentId: event.expectedConsentId,
      };

      const commands: SendTxEmailCommand[] = [];

      switch (interaction) {
        // Expected Interaction
        case ChallengeInteraction.Expected:
          commands.push(
            new SendTxEmailCommand(
              userId,
              variables.userEmailAddress,
              variables.userFullName,
              Transaction.ExpectedConsentRequested,
              variables,
              challengeInteractionId,
            ),
          );
          commands.push(
            new SendTxEmailCommand(
              userId,
              variables.senderEmailAddress ?? '',
              '',
              Transaction.ReceiptExemptionRequested,
              variables,
              challengeInteractionId,
            ),
          );
          break;

        // Donated Interaction
        case ChallengeInteraction.Donated:
          // eslint-disable-next-line no-case-declarations
          const hasFirstDonation = await this.emailRepo.findOne({
            transaction: Transaction.FirstDonationReceived,
            userId,
          });

          commands.push(
            new SendTxEmailCommand(
              userId,
              variables.userEmailAddress,
              variables.userFullName,
              hasFirstDonation
                ? Transaction.DonationReceived
                : Transaction.FirstDonationReceived,
              variables,
              challengeInteractionId,
            ),
            new SendTxEmailCommand(
              userId,
              variables.senderEmailAddress ?? '',
              '',
              Transaction.ReceiptDonation,
              variables,
              challengeInteractionId,
            ),
          );
          break;

        default:
          return;
      }

      for (let i = 0; i < commands.length; i++) {
        await this.commandBus.execute(commands[i]);
      }
    } catch (error) {
      this.log.error(
        { error },
        'Error sending tx emails for challenge interaction.',
      );
      throw error;
    } finally {
      await releaseCache();
    }
  }
}
