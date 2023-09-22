import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';

import { SentReceivedEntity } from '../../entities/sent-received.entity';
import { ServiceProviderService } from '../../services/service-provider.service';

import { TrackSentReceivedCommand } from './track-sent-received.command';

@CommandHandler(TrackSentReceivedCommand)
export class TrackSentReceivedCommandHandler
  implements ICommandHandler<TrackSentReceivedCommand>
{
  constructor(
    private em: EntityManager,
    private serviceProviderService: ServiceProviderService,
  ) {}

  async execute(command: TrackSentReceivedCommand): Promise<any> {
    await this.em
      .createQueryBuilder(SentReceivedEntity)
      .insert(
        this.serviceProviderService.buildSentReceiveEntitiesFromMessage(
          command.message,
        ),
      )
      .onConflict(['user_id', 'external_message_id', 'username', 'domain'])
      .ignore()
      .execute('run');
  }
}
