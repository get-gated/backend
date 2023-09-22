import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import ChallengeUserSettingEntity from '../../entities/user-setting.entity';
import { ChallengeUserSettingsQuery } from '../../queries/user-settings/user-settings.query';

import { UserSettingsCommand } from './user-settings.command';
import { UserSettingsRequest } from './user-settings.request.dto';

@Resolver()
export class UserSettingsGraphqlResolver {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Mutation(() => ChallengeUserSettingEntity)
  @Allow(Role.User)
  async challengeUserSettingsUpdate(
    @Args('input') input: UserSettingsRequest,
    @User() user: AuthedUser,
  ): Promise<ChallengeUserSettingEntity> {
    await this.commandBus.execute(
      new UserSettingsCommand(
        user.userId,
        input.signature,
        input.nonprofitId,
        input.minimumDonation,
        input.injectResponses,
        input.nonprofitReason,
      ),
    );
    return this.queryBus.execute(new ChallengeUserSettingsQuery(user.userId));
  }
}
