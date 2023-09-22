import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Provider,
  Status,
} from '@app/interfaces/service-provider/service-provider.enums';
import { LoggerService } from '@app/modules/logger';

import ConnectionRepository from '../../entities/repositories/connection.repository';
import { GoogleService } from '../../services/provider/adapters/google/google.service';
import { ManagedBy } from '../../service-provider.enums';
import ConnectionEntity from '../../entities/connection.entity';

import { WatchGmailAccountsCommand } from './watch-gmail-accounts.command';

@CommandHandler(WatchGmailAccountsCommand)
export class WatchGmailAccountsCommandHandler
  implements ICommandHandler<WatchGmailAccountsCommand>
{
  constructor(
    private readonly google: GoogleService,
    private readonly connRepo: ConnectionRepository,
    private readonly log: LoggerService,
  ) {}

  private async getPage(offset: number): Promise<ConnectionEntity[]> {
    return this.connRepo.find(
      {
        provider: Provider.Google,
        deletedAt: null,
        status: { $ne: Status.Invalid },
        managedBy: ManagedBy.Internal,
      },
      {
        limit: 50,
        offset,
      },
    );
  }

  async execute(): Promise<any> {
    let offset = 0;

    const processPage = async (): Promise<void> => {
      const connections = await this.getPage(offset);

      if (connections.length === 0) return;

      offset += connections.length;

      await Promise.all(
        connections.map(async (conn) => {
          try {
            await this.google.updateEmailAddress(conn);
          } catch (error) {
            this.log.error(
              { error, userId: conn.userId, connectionId: conn.connectionId },
              'Unable to update email address',
            );
          }
          try {
            await this.google.renewWatch(conn);
          } catch (error) {
            this.log.error(
              { error, userId: conn.userId, connectionId: conn.connectionId },
              'Unable to renew watch subscription.',
            );
          }

          conn.updatedAt = new Date();
          this.connRepo.persist(conn); // lastHistoryId is updated on conn and email address may have changed
        }),
      );

      return processPage();
    };
    await processPage();
    await this.connRepo.flush();
  }
}
