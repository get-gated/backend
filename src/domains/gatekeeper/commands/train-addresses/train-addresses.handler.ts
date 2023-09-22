import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UtilsService } from '@app/modules/utils';
import { GatekeeperTrainingAddedEvent } from '@app/events/gatekeeper/gatekeeper-training-added.event';
import { EventBusService } from '@app/modules/event-bus';
import { LoggerService } from '@app/modules/logger';
import { QueryOrder } from '@mikro-orm/core';

import TrainingEntity from '../../entities/training.entity';
import TrainingRepository from '../../entities/repositories/training.repository';

import { TrainAddressesCommand } from './train-addresses.command';

@CommandHandler(TrainAddressesCommand)
export class TrainAddressesHandler
  implements ICommandHandler<TrainAddressesCommand>
{
  constructor(
    private readonly utils: UtilsService,
    private readonly trainingRepository: TrainingRepository,
    private readonly eventBus: EventBusService,
    private log: LoggerService,
  ) {}

  async execute(command: TrainAddressesCommand): Promise<string[]> {
    this.log.info({ command }, 'Executing TrainAddressesCommand');
    try {
      const events: GatekeeperTrainingAddedEvent[] = [];
      const trainings: TrainingEntity[] = [];
      await Promise.all(
        command.addresses.map(async (address): Promise<void> => {
          let username;
          let domain;
          try {
            const norm = this.utils.normalizeEmail(address);
            username = norm.username;
            domain = norm.domain;

            if (!domain) {
              // not sure why this occurring. probably need to fix upstream, but this is the only place its manifesting as of now. adding logging to better understand root cause
              this.log.warn(
                { address },
                'Domain not found on provided email address. Ignoring.',
              );
              return;
            }
          } catch (error) {
            this.log.error(
              { error, address },
              'Unable to normalize email for training',
            );
            return;
          }

          const entity = await this.trainingRepository.findOne(
            {
              userId: command.userId,
              username,
              domain,
            },
            { orderBy: { createdAt: QueryOrder.DESC } },
          );

          if (command.preventOverwrite) {
            if (entity) return;
          }

          // prevent duplicate entries
          if (
            entity &&
            entity.username === username &&
            entity.domain === domain &&
            entity.origin === command.origin &&
            entity.rule === command.rule
          ) {
            trainings.push(entity);
            return;
          }

          const training = new TrainingEntity({
            userId: command.userId,
            username,
            domain,
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
      this.log.error({ error }, 'TrainAddresses command failed');
      throw error;
    }
  }
}
