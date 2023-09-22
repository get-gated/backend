import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { LoggerService } from '@app/modules/logger';

import { PushService } from '../../services/push/push.service';
import PushTokenEntity from '../../entities/push-token.entity';
import UserSettingsEntity from '../../entities/user-settings.entity';
import PushReceiptEntity from '../../entities/push-receipt.entity';

import { SendPushCommand } from './send-push.command';

@CommandHandler(SendPushCommand)
export class SendPushCommandHandler
  implements ICommandHandler<SendPushCommand>
{
  constructor(
    private pushService: PushService,
    @InjectRepository(PushTokenEntity)
    private pushTokenRepo: EntityRepository<PushTokenEntity>,
    @InjectRepository(UserSettingsEntity)
    private userSettings: EntityRepository<UserSettingsEntity>,
    @InjectRepository(PushReceiptEntity)
    private pushReceiptRepo: EntityRepository<PushReceiptEntity>,
    private em: EntityManager,
    private log: LoggerService,
  ) {}

  async execute(command: SendPushCommand): Promise<any> {
    const { userId, body, data } = command;

    const [pushTokens, settings] = await Promise.all([
      this.pushTokenRepo.find(
        { userId, deletedAt: null },
        { fields: ['token'] },
      ),
      this.userSettings.findOne({ userId, deletedAt: null }),
    ]);

    if (!settings) {
      return;
    }

    if (pushTokens.length === 0) return;

    const badge = settings.unread + 1;

    settings.unread = badge;
    this.userSettings.persist(settings);

    const response = await this.pushService.push({
      tokens: pushTokens.map((i) => i.token),
      body,
      data,
      badge,
    });

    const rejectedTokens: string[] = [];

    response.forEach((receipt) => {
      const token = pushTokens.find(
        (pushToken) => pushToken.token === receipt.token,
      );
      if (!token) {
        this.log.warn({ receipt }, 'did not find push token for receipt');
        return;
      }
      if (receipt.receiptId) {
        this.pushReceiptRepo.persist(
          new PushReceiptEntity({
            externalReceiptId: receipt.receiptId,
            body,
            badge,
            data: data ?? {},
            token,
          }),
        );
      }
      if (receipt.error === 'DeviceNotRegistered') {
        rejectedTokens.push(receipt.token);
      }
    });

    // delete rejected tokens so we dont push to them again
    if (rejectedTokens.length > 0) {
      await this.pushTokenRepo.nativeUpdate(
        { token: { $in: rejectedTokens } },
        {
          deletedAt: new Date(),
        },
      );
    }

    await this.em.flush();
  }
}
