import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException } from '@nestjs/common';

import PushTokenEntity from '../../entities/push-token.entity';
import { PushService } from '../../services/push/push.service';

import { AddPushTokenCommand } from './add-push-token.command';

@CommandHandler(AddPushTokenCommand)
export class AddPushTokenCommandHandler
  implements ICommandHandler<AddPushTokenCommand>
{
  constructor(
    @InjectRepository(PushTokenEntity)
    private pushTokenRepo: EntityRepository<PushTokenEntity>,
    private pushService: PushService,
  ) {}

  async execute(command: AddPushTokenCommand): Promise<void> {
    const { userId, token, device } = command;
    const isValid = this.pushService.validateToken(token);
    if (!isValid) {
      throw new BadRequestException('Invalid push token');
    }

    let pushToken = await this.pushTokenRepo.findOne({ token });

    if (pushToken) {
      pushToken.userId = userId;
      pushToken.deletedAt = null;
      pushToken.device = device;
    } else {
      pushToken = new PushTokenEntity({
        userId,
        token,
        device,
      });
    }

    await this.pushTokenRepo.persistAndFlush(pushToken);
  }
}
