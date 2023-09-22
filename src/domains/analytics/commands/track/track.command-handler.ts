import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticAdapter } from '../../services/adapters/adapter.interface';

import { TrackCommand } from './track.command';

@CommandHandler(TrackCommand)
export class TrackCommandHandler implements ICommandHandler<TrackCommand> {
  constructor(private analytics: AnalyticsService) {}

  async execute(command: TrackCommand): Promise<any> {
    await this.analytics.adapters[AnalyticAdapter.Segment].track(
      command.userId,
      command.eventName,
      command.properties,
      command.context,
    );
  }
}
