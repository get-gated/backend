import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthAdapter, AuthProviderService } from '@app/modules/auth';
import { NotFoundException } from '@nestjs/common';
import { LoggerService } from '@app/modules/logger';

import { AuthWithIdTokenCommand } from './auth-with-id-token.command';

@CommandHandler(AuthWithIdTokenCommand)
export class AuthWithIdTokenCommandHandler
  implements ICommandHandler<AuthWithIdTokenCommand>
{
  constructor(
    private authAdapter: AuthAdapter,
    private authProvider: AuthProviderService,
    private log: LoggerService,
  ) {}

  async execute(command: AuthWithIdTokenCommand): Promise<any> {
    const adapter = this.authProvider.adapters[command.provider];
    const providerUserId = await adapter.getProviderUserIdFromIdToken(
      command.idToken,
    );

    if (!providerUserId) {
      this.log.error({ command }, 'unable to obtain provider userId');
      return;
    }

    const userId = await this.authAdapter.getUserIdByProviderUserId(
      command.provider,
      providerUserId,
    );

    if (!userId) {
      throw new NotFoundException();
    }

    return this.authAdapter.getAuthenticationToken(userId);
  }
}
