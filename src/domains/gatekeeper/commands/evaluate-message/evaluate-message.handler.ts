import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GatekeeperDecisionMadeEvent } from '@app/events/gatekeeper/gatekeeper-decision-made.event';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EventBusService } from '@app/modules/event-bus';
import { LoggerService } from '@app/modules/logger';
import {
  Counter,
  Metric,
  SpanEvent,
  TelemetryService,
} from '@app/modules/telemetry';

import { GatekeeperService } from '../../gatekeeper.service';
import DecisionEntity from '../../entities/decision.entity';

import { EvaluateMessageCommand } from './evaluate-message.command';

@CommandHandler(EvaluateMessageCommand)
export class EvaluateMessageHandler
  implements ICommandHandler<EvaluateMessageCommand>
{
  constructor(
    @InjectRepository(DecisionEntity)
    private decisionRepository: EntityRepository<DecisionEntity>,
    private log: LoggerService,
    private eventBus: EventBusService,
    private em: EntityManager,
    private gatekeeperService: GatekeeperService,
    private readonly telemetry: TelemetryService,
  ) {
    this.decisionCounter = this.telemetry.getMetricCounter(
      Metric.DecisionMade,
      {
        description: 'Gatekeeper decisions',
      },
    );
  }

  private decisionCounter: Counter;

  public async execute(command: EvaluateMessageCommand): Promise<any> {
    const { message } = command;
    const decision = await this.gatekeeperService.evaluateMessage(message);

    if (!message.messageId || !message.threadId) {
      this.log.warn({ command }, 'missing messageId or threadId on message');
      return;
    }

    const newDecision = new DecisionEntity({
      userId: message.userId,
      emailAddress: message.from.emailAddress,
      messageId: message.messageId,
      threadId: message.threadId,
      connectionId: message.connectionId,
      ...decision,
    });
    this.decisionRepository.persist(newDecision);
    const event = new GatekeeperDecisionMadeEvent({ ...newDecision, message });

    await this.em.flush(); // persist

    // telemetry
    const telemetryPayload = {
      ruling: event.ruling,
      verdict: event.verdict,
    };
    this.telemetry.addSpanEvent(SpanEvent.MessageDecided, telemetryPayload);
    this.decisionCounter.add(1, telemetryPayload);

    return this.eventBus.publish(event); // publish event once transaction complete
  }
}
