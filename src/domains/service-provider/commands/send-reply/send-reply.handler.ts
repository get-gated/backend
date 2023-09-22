import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoggerService } from '@app/modules/logger';

import HistoryMessageRepository from '../../entities/repositories/history-message.repository';
import HistoryThreadRepository from '../../entities/repositories/history-thread.repository';
import ConnectionRepository from '../../entities/repositories/connection.repository';
import { ProviderService } from '../../services/provider/provider.service';
import { ThreadNotFoundError } from '../../errors/thread-not-found.error';
import { TPartialSentMessage } from '../../services/provider/adapters/provider.adapter.interface';
import { MessageNotFoundError } from '../../errors/message-not-found.error';

import { SendReplyCommand } from './send-reply.command';

@CommandHandler(SendReplyCommand)
export class SendReplyHandler implements ICommandHandler<SendReplyCommand> {
  constructor(
    private providerService: ProviderService,
    private messageRepo: HistoryMessageRepository,
    private threadRepo: HistoryThreadRepository,
    private connectionRepo: ConnectionRepository,
    private log: LoggerService,
  ) {}

  async execute(command: SendReplyCommand): Promise<string | undefined> {
    const { messageId, to, threadId } = command;
    const message = await this.messageRepo.findOne(
      { messageId },
      { fields: ['externalMessageId'] },
    );
    if (!message) {
      return;
    }
    const connection = await this.connectionRepo.findOneOrFail(
      command.connectionId,
    );

    let newMessagePartial: TPartialSentMessage;
    try {
      newMessagePartial = await this.providerService.adapters[
        connection.provider
      ].sendReply(connection, message.externalMessageId, command.body, to);
    } catch (error) {
      if (
        error instanceof ThreadNotFoundError ||
        error instanceof MessageNotFoundError
      ) {
        this.log.warn(
          { threadId, messageId },
          'Thread or message was not found. Ignoring send reply request.',
        );
        return;
      }

      throw error;
    }

    const newMessage = await this.messageRepo.upsert(
      { externalMessageId: newMessagePartial.externalMessageId },
      {
        ...newMessagePartial,
        thread: this.threadRepo.getReference(threadId),
      },
    );

    await this.messageRepo.flush();

    return newMessage.messageId;
  }
}
