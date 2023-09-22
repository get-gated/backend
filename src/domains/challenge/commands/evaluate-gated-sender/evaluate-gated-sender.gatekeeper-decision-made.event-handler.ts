import { Injectable } from '@nestjs/common';
import { GatekeeperDecisionMadeEvent } from '@app/events/gatekeeper/gatekeeper-decision-made.event';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';

import { EvaluateGatedSenderCommand } from './evaluate-gated-sender.command';

@EventHandler(GatekeeperDecisionMadeEvent, 'challenge-evaluate-gated-sender')
@Injectable()
export default class EvaluateGatedSenderGatekeeperDecisionMadeEventHandler
  implements IEventHandler<GatekeeperDecisionMadeEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: GatekeeperDecisionMadeEvent): Promise<void> {
    const { connectionId, threadId, message, ruling, userId, emailAddress } =
      event;

    if (ruling !== Rule.Gate) return;

    return this.commandBus.execute(
      new EvaluateGatedSenderCommand(
        connectionId,
        threadId,
        message,
        userId,
        emailAddress,
      ),
    );
  }
}
