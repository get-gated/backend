import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  AllowThreadReason,
  Rule,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { GatekeeperDecisionMadeEvent } from '@app/events/gatekeeper/gatekeeper-decision-made.event';

import { AllowThreadCommand } from './allow-thread.command';

/**
 * @name GatekeeperDecisionMadeEvent
 * @description
 * Watch for Allowed decisions made
 * and mark the thread as allowed so that all
 * future replies to the thread can be allowed
 * regardless of trainings.
 */
@EventHandler(GatekeeperDecisionMadeEvent, 'gatekeeper-allow-thread')
@Injectable()
export default class AllowThreadDecisionMadeEventHandler
  implements IEventHandler<GatekeeperDecisionMadeEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: GatekeeperDecisionMadeEvent): Promise<void> {
    const { threadId, ruling } = event;

    if (ruling !== Rule.Allow) return;

    await this.commandBus.execute(
      new AllowThreadCommand(threadId, AllowThreadReason.AllowedSenderStarted),
    );
  }
}
