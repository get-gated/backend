import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthAdapter, Provider } from '@app/modules/auth';
import UserNotFoundError from '@app/errors/user/user-not-found.error';
import { LoggerService } from '@app/modules/logger';

import { ServiceProviderAppService } from '../../../service-provider';

import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private authAdapter: AuthAdapter,
    private serviceProvider: ServiceProviderAppService,
    private log: LoggerService,
  ) {}

  async execute(command: LoginCommand): Promise<string> {
    let userId: string | void;
    try {
      if (command.providerUser.provider === Provider.Google) {
        const connection =
          await this.serviceProvider.queryConnectionByProviderUserId({
            providerUserId: command.providerUser.sub,
          });
        if (!connection?.deletedAt) {
          userId = connection?.userId;
        }
      }

      if (!userId) {
        userId = await this.authAdapter.getUserIdByProviderUserId(
          command.providerUser.provider,
          command.providerUser.sub,
        );
      }

      if (!userId) {
        throw new UserNotFoundError();
      }

      return await this.authAdapter.getAuthenticationToken(userId);
    } catch (error) {
      this.log.warn({ error, userId }, 'Error logging user in');
      throw error;
    }
  }
}
