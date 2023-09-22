import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthAdapter, Role } from '@app/modules/auth';
import { EventBusService } from '@app/modules/event-bus';
import { UserJoinedEvent } from '@app/events/user/user-joined.event';

import { ExistingUserError, UserService } from '../../user.service';
import UserEntity from '../../entities/user.entity';

import { SignupCommand } from './signup.command';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
  constructor(
    private authAdapter: AuthAdapter,
    private eventBus: EventBusService,
    private userService: UserService,
  ) {}

  async execute(command: SignupCommand): Promise<any> {
    let internalUser: UserEntity;
    const getAuthToken = (userId: string): Promise<string> =>
      this.authAdapter.getAuthenticationToken(userId);

    const {
      provider,
      sub: providerUserId,
      emailAddress,
      firstName,
      lastName,
      avatar,
    } = command.providerUser;

    try {
      const roles = [Role.User];
      if (this.authAdapter.isAdmin(command.providerUser.emailAddress)) {
        roles.push(Role.Admin);
      }
      internalUser = await this.userService.createUser(
        {
          firstName,
          lastName,
          provider,
          providerUserId,
          emailAddress,
          roles,
          avatar,
        },
        command.referralCode,
      );
    } catch (error) {
      if (error instanceof ExistingUserError) {
        const userId = await this.authAdapter.getUserIdByProviderUserId(
          provider,
          providerUserId,
        );
        if (!userId)
          throw new Error(
            'Unable to recover existing user. Exists in db but not identity platform.',
          );

        return getAuthToken(userId);
      }
      throw error;
    }

    await this.eventBus.publish(
      new UserJoinedEvent({
        ...internalUser,
        fullName: internalUser.fullName,
        joinedWithEmail: command.providerUser.emailAddress,
        defaultNonprofitId: command.defaultNonprofitId,
        referredByUserId: internalUser.referredByUserId,
      }),
    );

    return getAuthToken(internalUser.userId);
  }
}
