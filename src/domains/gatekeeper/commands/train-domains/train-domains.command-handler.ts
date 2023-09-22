import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GatekeeperTrainingAddedEvent } from '@app/events/gatekeeper/gatekeeper-training-added.event';
import { EventBusService } from '@app/modules/event-bus';
import { LoggerService } from '@app/modules/logger';

import TrainingRepository from '../../entities/repositories/training.repository';
import TrainingEntity from '../../entities/training.entity';

import { TrainDomainsCommand } from './train-domains.command';

@CommandHandler(TrainDomainsCommand)
export class TrainDomainsCommandHandler
  implements ICommandHandler<TrainDomainsCommand>
{
  constructor(
    private readonly trainingRepository: TrainingRepository,
    private readonly eventBus: EventBusService,
    private log: LoggerService,
  ) {}

  async execute(command: TrainDomainsCommand): Promise<string[]> {
    this.log.info({ command }, 'Executing TrainDomainsCommand');
    try {
      const events: GatekeeperTrainingAddedEvent[] = [];
      const trainings: TrainingEntity[] = [];
      await Promise.all(
        command.domains.map(async (domain) => {
          const trainDomain = domain.toLowerCase();
          const entity = await this.trainingRepository.findOne({
            userId: command.userId,
            domain: trainDomain,
            username: null,
          });

          if (entity && command.preventOverwrite) return;

          const training = new TrainingEntity({
            userId: command.userId,
            domain: trainDomain,
            origin: command.origin,
            rule: command.rule,
          });
          trainings.push(training);
          const event = new GatekeeperTrainingAddedEvent(training);
          events.push(event);
        }),
      );
      await this.trainingRepository.persistAndFlush(trainings); // persist trainings
      await Promise.all(events.map((e) => this.eventBus.publish(e))); // publish training events
      return trainings.map((training) => training.trainingId);
    } catch (error) {
      this.log.error({ error }, 'TrainDomains command failed');
      throw error;
    }
  }
}
