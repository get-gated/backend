import { Injectable } from '@nestjs/common';
import { ParticipantInterface } from '@app/interfaces/service-provider/participant.interface';
import {
  MessageType,
  ParticipantField,
} from '@app/interfaces/service-provider/service-provider.enums';
import { UtilsService } from '@app/modules/utils';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

import { SentReceivedEntity } from '../entities/sent-received.entity';

@Injectable()
export class ServiceProviderService {
  constructor(private utils: UtilsService) {}

  public buildSentReceiveEntitiesFromMessage(
    message: ConnectionEmailMessageInterface,
  ): SentReceivedEntity[] {
    const sentReceivedEntities: SentReceivedEntity[] = [];
    const addSentReceived = (
      participant: ParticipantInterface,
      field: ParticipantField,
    ): void => {
      const { domain, username } = this.utils.normalizeEmail(
        participant.emailAddress,
      );
      sentReceivedEntities.push(
        new SentReceivedEntity({
          createdAt: message.receivedAt,
          domain,
          username,
          participant,
          type: message.type,
          participantField: field,
          externalMessageId: message.externalMessageId,
          userId: message.userId,
          connectionId: message.connectionId,
        }),
      );
    };

    if (message.type === MessageType.Sent) {
      message.to.forEach((p) => addSentReceived(p, ParticipantField.To));
      message.cc?.forEach((p) => addSentReceived(p, ParticipantField.Cc));
      message.bcc?.forEach((p) => addSentReceived(p, ParticipantField.Bcc));
    } else if (message.type === MessageType.Received) {
      addSentReceived(message.from, ParticipantField.From);
    }

    return sentReceivedEntities;
  }
}
