import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import UserSettingsEntity from '../../entities/user-settings.entity';

import { UpdateUserSettingsCommand } from './update-user-settings.command';
import {
  UpdateUserSettingsAdminRequestDto,
  UpdateUserSettingsRequestDto,
} from './update-user-settings.request.dto';

@Resolver()
export class UpdateUserSettingsGraphqlResolver {
  constructor(
    private commandBus: CommandBus,
    @InjectRepository(UserSettingsEntity)
    private userSettingsRepo: EntityRepository<UserSettingsEntity>,
  ) {}

  @Mutation(() => UserSettingsEntity)
  @Allow(Role.User)
  async notificationUserSettingsUpdate(
    @Args('input') input: UpdateUserSettingsRequestDto,
    @User() { userId }: AuthedUser,
  ): Promise<UserSettingsEntity> {
    await this.commandBus.execute(
      new UpdateUserSettingsCommand(userId, input.emailAddress),
    );
    return this.userSettingsRepo.findOneOrFail({ userId });
  }

  @Mutation(() => UserSettingsEntity)
  @Allow(Role.Admin)
  async notificationUserSettingsAdminUpdate(
    @Args('input') input: UpdateUserSettingsAdminRequestDto,
  ): Promise<UserSettingsEntity> {
    await this.commandBus.execute(
      new UpdateUserSettingsCommand(
        input.userId,
        input.emailAddress,
        input.disableTxEmail,
      ),
    );
    return this.userSettingsRepo.findOneOrFail({ userId: input.userId });
  }
}
