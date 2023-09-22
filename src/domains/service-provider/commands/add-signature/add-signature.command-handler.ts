import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';

import ConnectionRepository from '../../entities/repositories/connection.repository';
import { ProviderService } from '../../services/provider/provider.service';

import { AddSignatureCommand } from './add-signature.command';

export class ConnectionInUseError extends BadRequestException {
  public readonly code = 'CONNECTION_IN_USE';

  constructor() {
    super('Connection in use by other user');
  }
}

@CommandHandler(AddSignatureCommand)
export class AddSignatureCommandHandler
  implements ICommandHandler<AddSignatureCommand>
{
  constructor(
    private providerService: ProviderService,
    private connectionRepo: ConnectionRepository,
  ) {}

  async execute(command: AddSignatureCommand): Promise<void> {
    const { userId, provider, providerToken, providerUserId, signature } =
      command;

    const connection = await this.connectionRepo.findOneOrFail({
      userId,
      providerUserId,
      provider,
    });
    connection.providerToken = providerToken;

    const serviceProvider = this.providerService.adapters[provider];

    await serviceProvider.addSignature(connection, signature);
  }
}
