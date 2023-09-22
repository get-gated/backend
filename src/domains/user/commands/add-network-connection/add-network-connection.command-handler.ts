import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UtilsService } from '@app/modules/utils';
import { EventBusService } from '@app/modules/event-bus';
import { UserNetworkConnectionAddedEvent } from '@app/events/user/user-network-connection-added.event';

import UserEntity from '../../entities/user.entity';
import UserNetworkConnectionEntity from '../../entities/network-connection.entity';
import { ServiceProviderAppService } from '../../../service-provider';

import { AddNetworkConnectionCommand } from './add-network-connection.command';

@CommandHandler(AddNetworkConnectionCommand)
export class AddNetworkConnectionCommandHandler
  implements ICommandHandler<AddNetworkConnectionCommand>
{
  constructor(
    private serviceProviderAppService: ServiceProviderAppService,
    @InjectRepository(UserNetworkConnectionEntity)
    private networkConnRepo: EntityRepository<UserNetworkConnectionEntity>,
    @InjectRepository(UserEntity)
    private userRepo: EntityRepository<UserEntity>,
    private utils: UtilsService,
    private eventBus: EventBusService,
  ) {}

  async execute(command: AddNetworkConnectionCommand): Promise<void> {
    const {
      userId,
      externalIdentifier,
      avatar,
      name,
      metWithGated,
      gatedUserId,
    } = command;

    let gatedUser: UserEntity | undefined;

    if (gatedUserId) {
      gatedUser = this.userRepo.getReference(gatedUserId);
    } else {
      const connection =
        await this.serviceProviderAppService.queryConnectionByEmail({
          emailAddress: this.utils.normalizeEmail(externalIdentifier).email,
        });

      if (connection) {
        gatedUser = this.userRepo.getReference(connection.userId);
      }
    }

    let entity = await this.networkConnRepo.findOne({
      userId,
      externalIdentifier,
    });

    if (entity) {
      entity.updatedAt = new Date();
      entity.avatar = avatar;
      entity.name = name ?? '';
      entity.gatedUser = gatedUser;
      entity.metWithGated = !!metWithGated;
    } else {
      entity = new UserNetworkConnectionEntity({
        user: this.userRepo.getReference(userId),
        avatar,
        name: name ?? '',
        externalIdentifier,
        metWithGated: !!metWithGated,
        gatedUser,
      });
    }

    await this.networkConnRepo.persistAndFlush(entity);

    await this.eventBus.publish(new UserNetworkConnectionAddedEvent(entity));
  }
}
