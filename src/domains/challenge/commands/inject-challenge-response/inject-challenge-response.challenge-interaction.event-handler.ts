import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeInteractionEvent } from '@app/events/challenge/challenge-interaction.event';
import { CommandBus } from '@nestjs/cqrs';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { UtilsService } from '@app/modules/utils';
import { Cache } from 'cache-manager';

import { ServiceProviderAppService } from '../../../service-provider';

import { InjectChallengeResponseCommand } from './inject-challenge-response.command';

@EventHandler(ChallengeInteractionEvent, 'service-provider-inject-message')
export class InjectChallengeResponseChallengeInteractionEventHandler
  implements IEventHandler<ChallengeInteractionEvent>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly serviceProvider: ServiceProviderAppService,
    private utils: UtilsService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  private async getSenderName(messageId: string): Promise<string | undefined> {
    const message = await this.serviceProvider.queryMessage(messageId);
    return message.from.displayName;
  }

  private readonly supportInteractions = [
    ChallengeInteraction.Donated,
    ChallengeInteraction.Expected,
  ];

  async handler(event: ChallengeInteractionEvent): Promise<void> {
    if (!event.challenge.injectResponses) return;

    if (!this.supportInteractions.includes(event.interaction)) return;

    if (
      ![ChallengeInteraction.Donated, ChallengeInteraction.Donated].includes(
        event.interaction,
      )
    ) {
      return;
    }

    const cacheKey = `inject-challenge-response-${event.challenge.sentMessageId}_${event.challenge.connectionId}`;
    if (await this.cache.get(cacheKey)) return;

    await this.cache.set(cacheKey, true, { ttl: 5 });

    try {
      let body = '';
      let respondingTo:
        | ChallengeInteraction.Donated
        | ChallengeInteraction.Expected = ChallengeInteraction.Expected;

      if (event.interaction === ChallengeInteraction.Donated) {
        respondingTo = ChallengeInteraction.Donated;
        body = `
        <html>
          <body>
            <p>I've just donated ${this.utils.formatCurrency(
              event.paymentAmount ?? 0,
            )} to ${event.challenge.nonprofit.name} to reach your inbox.</p>
            <p>${event.personalizedNote}</p>
            <p>
              ---------------------------<br />
              This messages was sent on behalf of ${
                event.challenge.to
              } by <a href="https://gated.com">Gated</a>.
            </p> 
          </body>
        </html>  
      `;
      } else {
        respondingTo = ChallengeInteraction.Expected;
        body = `
        <html>
          <body>
            <p>${event.personalizedNote}</p>
            <p>
              ---------------------------<br />
              This messages was sent on behalf of ${event.challenge.to} by <a href="https://gated.com">Gated</a>.<br />
            </p> 
          </body>
        </html>  
      `;
      }

      await this.commandBus.execute(
        new InjectChallengeResponseCommand(
          {
            connectionId: event.challenge.connectionId,
            body,
            isUnread: true,
            fromEmail: event.challenge.to,
            fromName: await this.getSenderName(event.challenge.messageId),
            replyToMessageId: event.challenge.sentMessageId,
          },
          event.challenge.userId,
          respondingTo,
        ),
      );
    } finally {
      await this.cache.del(cacheKey);
    }
  }
}
