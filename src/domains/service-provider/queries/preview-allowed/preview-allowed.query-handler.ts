import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  MessageType,
  Status,
} from '@app/interfaces/service-provider/service-provider.enums';
import { ParticipantInterface } from '@app/interfaces/service-provider/participant.interface';
import { UtilsService } from '@app/modules/utils';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

import { ProviderService } from '../../services/provider/provider.service';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { PreviewAllowedSender } from './preview-allowed.response.dto';
import { PreviewAllowedQuery } from './preview-allowed.query';

interface Recipients extends ParticipantInterface {
  count: number;
}

@QueryHandler(PreviewAllowedQuery)
export class PreviewAllowedQueryHandler
  implements IQueryHandler<PreviewAllowedQuery>
{
  constructor(
    private connectionRepo: ConnectionRepository,
    private providerService: ProviderService,
    private utils: UtilsService,
  ) {}

  async execute(query: PreviewAllowedQuery): Promise<PreviewAllowedSender[]> {
    const { connectionId } = query;
    const connection = await this.connectionRepo.findOneOrFail(connectionId);

    if (connection.status === Status.Invalid) {
      throw new Error('Can not preview. Connection status "invalid".');
    }

    const { isCustomDomain, domain } = this.utils.normalizeEmail(
      connection.emailAddress,
      connection.provider,
    );
    const customDomain = isCustomDomain ? domain : '';
    const result = await this.providerService.adapters[
      connection.provider
    ].recentSentMessages(connection, undefined, true, customDomain);

    const messages =
      result?.messages?.filter((message) => !message.wasSentBySystem) || [];

    const recipients: Recipients[] = [];

    const addRecipients = (participants: ParticipantInterface[]): void => {
      for (let i = participants.length - 1; i >= 0; i--) {
        const participant = participants[i];
        const recipient = recipients.find(
          (item) => item.emailAddress === participant.emailAddress,
        );

        if (recipient) {
          recipient.count++;
        } else {
          recipients.push({ ...participant, count: 1 });
        }
      }
    };

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.type === MessageType.Sent) {
        addRecipients([
          ...message.to,
          ...(message?.cc ?? []),
          ...(message?.bcc ?? []),
        ]);
      }
    }

    recipients.sort((a, b) => b.count - a.count);
    const topRecipients = recipients.slice(0, 10);

    const previews: PreviewAllowedSender[] = [];

    topRecipients.map(async (recipient) => {
      previews.push({
        id: recipient.emailAddress,
        sender: recipient,
        rule: Rule.Allow,
      });
    });

    return previews;
  }
}
