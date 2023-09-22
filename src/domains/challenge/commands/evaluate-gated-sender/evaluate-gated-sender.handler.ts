import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UtilsService } from '@app/modules/utils';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoggerService } from '@app/modules/logger';
import {
  Counter,
  Metric,
  SpanEvent,
  TelemetryService,
} from '@app/modules/telemetry';

import { ChallengeService } from '../../services/challenge.service';

import { EvaluateGatedSenderCommand } from './evaluate-gated-sender.command';

@CommandHandler(EvaluateGatedSenderCommand)
export class EvaluateGatedSenderHandler
  implements ICommandHandler<EvaluateGatedSenderCommand>
{
  constructor(
    private readonly log: LoggerService,
    private challengeService: ChallengeService,
    private utils: UtilsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly telemetry: TelemetryService,
  ) {
    this.challengeCounter = this.telemetry.getMetricCounter(
      Metric.ChallengeSent,
    );
  }

  private challengeCounter: Counter;

  public async execute(command: EvaluateGatedSenderCommand): Promise<any> {
    this.log.info({ command }, 'Executing EvaluateGatedSenderCommand');
    const { userId, message, threadId, to, connectionId } = command;
    const { messageId } = message;

    if (!messageId) {
      this.log.warn(
        { command },
        'messageId is not defined in EvaluateGatedSenderHandler',
      );
      return;
    }
    const cacheSignature = this.utils.createHash(
      JSON.stringify({ userId, messageId, threadId, to, connectionId }),
    );

    const inflight = await this.cacheManager.get(cacheSignature);
    if (inflight) return Promise.reject(new Error('Inflight')); // todo: updated with a well known error

    // set memcache of in-flight processing to prevent duplicate processing
    // 10 second ttl in case there is a failure and cache isnt auto deleted below;
    await this.cacheManager.set(
      cacheSignature,
      true,
      this.utils.timeInMs(10).secs(),
    );

    try {
      await this.challengeService.processChallenge(
        {
          messageId,
          to,
          threadId,
          userId,
          connectionId,
        },
        message,
      );
      this.telemetry.addSpanEvent(SpanEvent.MessageChallenged);
      this.challengeCounter.add(1);
    } catch (error) {
      this.log.error({ error }, 'Error processing EvaluateGatedSenderCommand');
      throw error;
    } finally {
      // release cache once recorded to db above
      await this.cacheManager.del(cacheSignature);
    }
  }
}
