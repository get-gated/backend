import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { LoggerService } from '@app/modules/logger';

import InjectedChallengeResponseEntity from '../../entities/injected-challenge-response.entity';
import { ServiceProviderAppService } from '../../../service-provider';

import { InjectChallengeResponseCommand } from './inject-challenge-response.command';

@CommandHandler(InjectChallengeResponseCommand)
export class InjectChallengeResponseCommandHandler
  implements ICommandHandler<InjectChallengeResponseCommand>
{
  constructor(
    private readonly serviceProvider: ServiceProviderAppService,
    @InjectRepository(InjectedChallengeResponseEntity)
    private readonly injectedRepo: EntityRepository<InjectedChallengeResponseEntity>,
    private readonly log: LoggerService,
  ) {}

  async execute(command: InjectChallengeResponseCommand): Promise<any> {
    try {
      const existing = await this.injectedRepo.findOne({
        replyToMessageId: command.message.replyToMessageId,
        connectionId: command.message.connectionId,
      });
      if (existing) {
        this.log.warn(
          { injectMessage: command.message },
          'Already processed injected response for message. Skipping',
        );
        return;
      }

      const messageId = await this.serviceProvider.commandInjectMessage(
        command,
      );

      await this.injectedRepo.persistAndFlush(
        new InjectedChallengeResponseEntity({
          messageId,
          ...command.message,
          userId: command.userId,
          respondingTo: command.respondingTo,
        }),
      );
    } catch (error) {
      this.log.error({ error }, 'Error injecting challenge response');
      throw error;
    }
  }
}
