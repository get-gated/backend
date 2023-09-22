import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProviderService } from '../../services/provider/provider.service';
import ConnectionRepository from '../../entities/repositories/connection.repository';
import HistoryMessageRepository from '../../entities/repositories/history-message.repository';

import { InjectMessageCommand } from './inject-message.command';

@CommandHandler(InjectMessageCommand)
export class InjectMessageCommandHandler
  implements ICommandHandler<InjectMessageCommand>
{
  constructor(
    private readonly provider: ProviderService,
    private readonly connRepo: ConnectionRepository,
    private readonly messageRepo: HistoryMessageRepository,
  ) {}

  async execute(command: InjectMessageCommand): Promise<any> {
    const { message } = command;
    const connection = await this.connRepo.findOneOrFail(message.connectionId);

    const provider = this.provider.adapters[connection.provider];

    let replyToMessageExternalId: string | undefined;
    if (message.replyToMessageId) {
      const replyTo = await this.messageRepo.findOneOrFail(
        message.replyToMessageId,
      );
      replyToMessageExternalId = replyTo.externalMessageId;
    }

    let insertInThreadWithMessageExternalId: string | undefined;
    if (message.insertInThreadWithMessageId) {
      const insertInThread = await this.messageRepo.findOneOrFail(
        message.insertInThreadWithMessageId,
      );
      insertInThreadWithMessageExternalId = insertInThread.externalMessageId;
    }

    const injectedMessage = await provider.insertMessage(connection, {
      ...message,
      replyToMessageExternalId,
      insertInThreadWithMessageExternalId,
    });

    const newMessage = await this.messageRepo.upsert(
      { externalMessageId: injectedMessage.externalMessageId },
      {
        ...injectedMessage,
        connection,
        userId: connection.userId,
      },
    );

    await this.messageRepo.persistAndFlush(newMessage);

    return newMessage.messageId;
  }
}
