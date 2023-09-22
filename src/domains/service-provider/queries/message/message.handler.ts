import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import HistoryMessageEntity from '../../entities/history-message.entity';
import HistoryMessageRepository from '../../entities/repositories/history-message.repository';

import { MessageQuery } from './message.query';

@Injectable()
@QueryHandler(MessageQuery)
export class MessageHandler implements IQueryHandler<MessageQuery> {
  constructor(private messageRepo: HistoryMessageRepository) {}

  async execute(query: MessageQuery): Promise<HistoryMessageEntity[]> {
    const { messageIds } = query;

    return this.messageRepo.find({ messageId: { $in: messageIds } });
  }
}
