import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { Provider as AuthProvider } from '@app/modules/auth';
import { ConfigType } from '@nestjs/config';
import { ConnectionInterface } from '@app/interfaces/service-provider/connection.interface';

import { SendReplyCommand } from './commands/send-reply/send-reply.command';
import { AddConnectionCommand } from './commands/add-connection/add-connection.command';
import { ReauthorizeConnectionCommand } from './commands/reauthorize-connection/reauthorize-connection.command';
import { SearchConnectionsQuery } from './queries/search-connections/search-connections.query';
import { ConnectionQuery } from './queries/connection/connection.query';
import ConnectionEntity from './entities/connection.entity';
import { mapProviderUtil } from './map-provider.util';
import { InjectMessageCommand } from './commands/inject-message/inject-message.command';
import ServiceProviderConfig from './service-provider.config';
import { MessageQuery } from './queries/message/message.query';
import HistoryMessageEntity from './entities/history-message.entity';
import { ConnectionByProviderUserIdQuery } from './queries/connection-by-provider-user-id/connection-by-provider-user-id.query';
import { ConnectionByEmailQuery } from './queries/connection-by-email/connection-by-email.query';
import { SentReceivedStatsQuery } from './queries/sent-received-stats/sent-received-stats.query';
import { TSentReceivedStatsQueryResponse } from './queries/sent-received-stats/sent-received-stats.query-handler';
import { MoveThreadCommand } from './commands/move-thread/move-thread.command';
import { HasSentToQuery } from './queries/has-sent-to/has-sent-to.query';

interface IConnection {
  userId: string;
  providerUserId: string;
  provider: AuthProvider;
  providerToken: string;
  providerEmail: string;
  legacyConnectionId?: string;
  activate?: boolean;
}

interface LabelNames {
  gated: string;
  expected: string;
  donated: string;
  trainAsAllowed: string;
  trainAsGated: string;
}

@Injectable()
export class ServiceProviderAppService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    @Inject(ServiceProviderConfig.KEY)
    private config: ConfigType<typeof ServiceProviderConfig>,
  ) {}

  public async commandSendReply(input: SendReplyCommand): Promise<string> {
    return this.commandBus.execute(
      new SendReplyCommand(
        input.connectionId,
        input.threadId,
        input.messageId,
        input.body,
        input.to,
      ),
    );
  }

  public async commandAddConnection(input: IConnection): Promise<string> {
    return this.commandBus.execute(
      new AddConnectionCommand(
        input.userId,
        input.providerUserId,
        mapProviderUtil(input.provider),
        input.providerToken,
        input.providerEmail,
        input.legacyConnectionId,
      ),
    );
  }

  public async commandReauthorizeConnection(input: IConnection): Promise<void> {
    await this.commandBus.execute(
      new ReauthorizeConnectionCommand(
        input.userId,
        input.providerUserId,
        mapProviderUtil(input.provider),
        input.providerToken,
        input.providerEmail,
      ),
    );
  }

  public async querySearchConnections(
    input: SearchConnectionsQuery,
  ): Promise<ConnectionEntity[]> {
    return this.queryBus.execute(new SearchConnectionsQuery(input.query));
  }

  public async queryConnectionIsActive(connectionId: string): Promise<boolean> {
    const connections: ConnectionEntity[] = await this.queryBus.execute(
      new ConnectionQuery([connectionId]),
    );
    if (!connections || connections.length !== 1) {
      throw new NotFoundException('Connection not found');
    }
    return connections[0].status !== Status.Invalid;
  }

  public async commandMoveThread(input: MoveThreadCommand): Promise<void> {
    await this.commandBus.execute(
      new MoveThreadCommand(
        input.connectionId,
        input.threadId,
        input.destination,
      ),
    );
  }

  public async queryHasSentTo(input: HasSentToQuery): Promise<boolean> {
    return this.queryBus.execute(
      new HasSentToQuery(input.userId, input.toEmailAddress),
    );
  }

  public async commandInjectMessage(
    input: InjectMessageCommand,
  ): Promise<string> {
    return this.commandBus.execute(new InjectMessageCommand(input.message));
  }

  public async queryMessage(messageId: string): Promise<HistoryMessageEntity> {
    const res = await this.queryBus.execute(new MessageQuery([messageId]));
    return res[0];
  }

  private labelNames(): LabelNames {
    return {
      gated: this.config.labels.gated.displayName,
      expected: this.config.labels.expected.displayName,
      donated: this.config.labels.donated.displayName,
      trainAsAllowed: this.config.labels.trainAsAllowed.displayName,
      trainAsGated: this.config.labels.trainAsGated.displayName,
    };
  }

  public async configLabelNames(): Promise<LabelNames> {
    return this.labelNames();
  }

  public queryConnectionByProviderUserId(
    query: ConnectionByProviderUserIdQuery,
  ): Promise<ConnectionInterface> {
    return this.queryBus.execute(
      new ConnectionByProviderUserIdQuery(query.providerUserId),
    );
  }

  public queryConnectionByEmail(
    query: ConnectionByEmailQuery,
  ): Promise<ConnectionInterface> {
    return this.queryBus.execute(
      new ConnectionByEmailQuery(query.emailAddress),
    );
  }

  public querySentReceivedStats(
    query: SentReceivedStatsQuery,
  ): Promise<TSentReceivedStatsQueryResponse> {
    return this.queryBus.execute(
      new SentReceivedStatsQuery(
        query.userId,
        query.sortBy,
        query.order,
        query.limit,
        query.offset,
        query.type,
        query.query,
        query.receivedCountGreaterThan,
        query.receivedCountLessThan,
        query.sentCountGreaterThan,
        query.sentCountLessThan,
        query.firstSeenAtSince,
      ),
    );
  }
}
