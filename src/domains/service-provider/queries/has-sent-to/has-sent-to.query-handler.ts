import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { LoggerService } from '@app/modules/logger';

import HistoryMessageEntity from '../../entities/history-message.entity';
import ConnectionRepository from '../../entities/repositories/connection.repository';
import HistoryMessageRepository from '../../entities/repositories/history-message.repository';
import { ProviderService } from '../../services/provider/provider.service';

import { HasSentToQuery } from './has-sent-to.query';

@QueryHandler(HasSentToQuery)
export class HasSentToQueryHandler implements IQueryHandler<HasSentToQuery> {
  constructor(
    @InjectRepository(HistoryMessageEntity)
    private messageRepo: HistoryMessageRepository,
    private connectionRepo: ConnectionRepository,
    private providerService: ProviderService,
    private log: LoggerService,
  ) {}

  async execute(query: HasSentToQuery): Promise<boolean> {
    const { userId, toEmailAddress } = query;

    // check if we have existing records
    const hasSentTo = await this.messageRepo.hasSentTo(userId, toEmailAddress);
    if (hasSentTo) {
      return true;
    }

    const connections = await this.connectionRepo.find({
      userId,
      isDisabled: false,
      status: Status.Running,
    });

    const results = await Promise.all(
      connections.map(async (connection) => {
        const adapter = this.providerService.adapters[connection.provider];
        try {
          const [hasSent = false] = await adapter.hasSentMessageTo(connection, [
            toEmailAddress,
          ]);
          return hasSent;
        } catch (error) {
          this.log.error(
            { error, connectionId: connection.connectionId },
            'Error occurred while checking sent messages. Aborting.',
          );
          return false;
        }
      }),
    );

    return results.some((value) => value);
  }
}
