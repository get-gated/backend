import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConnectionAddedEvent } from '@app/events/service-provider/connection-added.event';
import { CommandBus } from '@nestjs/cqrs';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { UtilsService } from '@app/modules/utils';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import GatekeeperConfig from '../../gatekeeper.config';

import { TrainDomainsCommand } from './train-domains.command';

/**
 * @name TrainDomainsConnectionAddedEventHandler
 * @desc
 * When a new connection is added for a user, add domain
 * trainings for initial default allowed domains and the
 * connected email addresses domain if its private.
 * This ensures we don't gate email from Gated support
 * and senders from their organization
 */
@EventHandler(ConnectionAddedEvent, 'gatekeeper-train-domains')
export class TrainDomainsConnectionAddedEventHandler
  implements IEventHandler<ConnectionAddedEvent>
{
  constructor(
    private commandBus: CommandBus,
    private utils: UtilsService,
    @Inject(GatekeeperConfig.KEY)
    private config: ConfigType<typeof GatekeeperConfig>,
  ) {}

  async handler(event: ConnectionAddedEvent): Promise<void> {
    const domains = [...this.config.defaultAllowedDomains];

    const { domain } = this.utils.normalizeEmail(event.emailAddress);

    if (this.utils.isPrivateEmailDomain(domain)) {
      domains.push(domain);
    }

    await this.commandBus.execute(
      new TrainDomainsCommand(
        event.userId,
        domains,
        Rule.Allow,
        TrainingOrigin.InitialDefaults,
        true,
      ),
    );
  }
}
