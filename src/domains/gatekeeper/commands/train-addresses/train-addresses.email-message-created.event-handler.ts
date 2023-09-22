import { EmailMessageCreatedEvent } from '@app/events/service-provider/email-message-created.event';
import { Injectable } from '@nestjs/common';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UtilsService } from '@app/modules/utils';
import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';

import TrainingRepository from '../../entities/repositories/training.repository';

import { TrainAddressesCommand } from './train-addresses.command';

@EventHandler(EmailMessageCreatedEvent, 'gatekeeper-train-addresses-command')
@Injectable()
export default class TrainAddressesEmailMessageCreatedEventHandler
  implements IEventHandler<EmailMessageCreatedEvent>
{
  constructor(
    private commandBus: CommandBus,
    private utils: UtilsService,
    private trainingRepo: TrainingRepository,
  ) {}

  async handler(event: EmailMessageCreatedEvent): Promise<any> {
    if (Boolean(event.calendarEvent) && event.type === MessageType.Received) {
      const { username, domain } = this.utils.normalizeEmail(
        event.from.emailAddress,
      );

      const addressTraining = await this.trainingRepo.findContactTraining(
        domain,
        username,
        event.userId,
      );
      const domainTraining = await this.trainingRepo.findDomainTraining(
        domain,
        event.userId,
      );

      const overwriteExistingTrainings =
        addressTraining?.rule === Rule.Allow ||
        domainTraining?.rule === Rule.Allow ||
        event.calendarEvent?.isUserOrganizer;

      return this.commandBus.execute(
        new TrainAddressesCommand(
          event.userId,
          [event.from.emailAddress],
          Rule.Allow,
          TrainingOrigin.Calendar,
          !overwriteExistingTrainings,
        ),
      );
    }

    if (event.type !== MessageType.Sent) return; // ignore received messages
    if (event.wasSentBySystem === true) return; // ignore challenge messages

    const participants = [
      ...event.to,
      ...(event.cc ?? []),
      ...(event.bcc ?? []),
    ];

    await this.commandBus.execute(
      new TrainAddressesCommand(
        event.userId,
        this.utils.getAddressesFromParticipants(participants),
        Rule.Allow,
        TrainingOrigin.SentEmail,
      ),
    );
  }
}
