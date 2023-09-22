import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { GatekeeperTrainingAddedEvent } from '@app/events/gatekeeper/gatekeeper-training-added.event';
import { TrainingOrigin } from '@app/interfaces/gatekeeper/gatekeeper.enums';

import { TTrackProperties } from '../../services/adapters/adapter.interface';
import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(GatekeeperTrainingAddedEvent, 'analytics-track')
export class TrackGatekeeperTrainingAddedEventHandler
  implements IEventHandler<GatekeeperTrainingAddedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: GatekeeperTrainingAddedEvent): Promise<void> {
    const originsOfInterest = [
      TrainingOrigin.AdminApp,
      TrainingOrigin.UserApp,
      TrainingOrigin.UserInbox,
    ];
    if (!originsOfInterest.includes(event.origin)) return;

    const properties: TTrackProperties = {
      trainingId: event.trainingId,
      rule: event.rule,
      origin: event.origin,
    };

    let eventName: AnalyticEvent;
    if (event.username) {
      eventName = AnalyticEvent.backend_user_TrainedAddress;
      properties.trainedAddress = `${event.username}@${event.domain}`;
    } else {
      eventName = AnalyticEvent.backend_user_TrainedDomain;
      properties.trainedDomain = event.domain;
    }

    await this.commandBus.execute(
      new TrackCommand(eventName, event.userId, properties),
    );
  }
}
