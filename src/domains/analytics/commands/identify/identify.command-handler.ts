import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AnalyticsService } from '../../services/analytics.service';

import { IdentifyCommand } from './identify.command';

@CommandHandler(IdentifyCommand)
export class IdentifyCommandHandler
  implements ICommandHandler<IdentifyCommand>
{
  constructor(private analytics: AnalyticsService) {}

  async execute(command: IdentifyCommand): Promise<any> {
    await this.analytics.adapters.segment.identify?.(
      command.userId,
      command.traits,
      command.context,
    );
  }
}
