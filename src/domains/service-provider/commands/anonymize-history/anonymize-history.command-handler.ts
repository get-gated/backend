import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import HistoryMessageRepository from '../../entities/repositories/history-message.repository';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { AnonymizeHistoryCommand } from './anonymize-history.command';

@CommandHandler(AnonymizeHistoryCommand)
export class AnonymizeHistoryCommandHandler
  implements ICommandHandler<AnonymizeHistoryCommand>
{
  constructor(
    private messageRepo: HistoryMessageRepository,
    private connectionRepo: ConnectionRepository,
  ) {}

  async execute(command: AnonymizeHistoryCommand): Promise<void> {
    const { userId, connectionId } = command;

    const connection = this.connectionRepo.getReference(connectionId);
    await this.messageRepo.nativeUpdate(
      { userId, connection, isAnonymized: false },
      {
        to: [],
        cc: [],
        bcc: [],
        replyTo: [],
        from: '',
        isAnonymized: true,
      },
    );
  }
}
