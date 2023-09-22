import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EmailMessageCreatedEvent } from '@app/events/service-provider/email-message-created.event';
import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeAction } from '@app/interfaces/challenge/challenge.enums';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeEntity from '../../entities/challenge.entity';

import MarkUserRepliedCommand from './mark-user-replied.command';

@EventHandler(EmailMessageCreatedEvent, 'challenge-mark-user-replied')
@Injectable()
export default class MarkUserRepliedEmailMessageCreatedEventHandler
  implements IEventHandler<EmailMessageCreatedEvent>
{
  constructor(
    private commandBus: CommandBus,
    @InjectRepository(ChallengeEntity)
    private challengeRepo: EntityRepository<ChallengeEntity>,
  ) {}

  async handler(event: EmailMessageCreatedEvent): Promise<void> {
    const { userId, messageId, threadId } = event;

    if (!messageId) {
      return;
    }

    // we are only interested in sent mail from the user
    if (event.type !== MessageType.Sent) return;

    if (event.wasSentBySystem) return;

    const challenge = await this.challengeRepo.findOne({
      userId,
      threadId,
      action: ChallengeAction.Present,
    });

    if (!challenge) return; // could not find a challenge for this thread

    await this.commandBus.execute(
      new MarkUserRepliedCommand(challenge.challengeId, messageId),
    );
  }
}
