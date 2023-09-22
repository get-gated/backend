import { ConflictException, Injectable } from '@nestjs/common';
import { AuthAdapter, Provider, Role } from '@app/modules/auth';
import { Maybe } from '@app/modules/utils';

import UserEntity from './entities/user.entity';
import UserRepository from './entities/repositories/user.repository';
import { UserPersonalizationEntity } from './entities/personalization.entity';

export class ExistingUserError extends ConflictException {
  constructor() {
    super('User already exists');
  }
}

interface ICreateUser {
  firstName: string;
  lastName: string;
  provider: Provider;
  providerUserId: string;
  emailAddress: string;
  roles: Role[];
  avatar: string;
  legacyUserId?: string;
  personalization?: UserPersonalizationEntity;
  isSignupCompleted?: boolean;
}

@Injectable()
export class UserService {
  constructor(
    private authAdapter: AuthAdapter,
    private userRepository: UserRepository,
  ) {}

  public async createUser(
    input: ICreateUser,
    referralCode?: string,
  ): Promise<any> {
    const existingUserId = await this.authAdapter.getUserIdByProviderUserId(
      input.provider,
      input.providerUserId,
    );

    if (existingUserId) {
      throw new ExistingUserError();
    }

    let referredByUser: Maybe<UserEntity>;

    if (referralCode) {
      referredByUser = await this.userRepository.findOne({ referralCode });
    }

    const user = new UserEntity({ ...input, referredByUser });

    await this.authAdapter.createUser(user, input.emailAddress);

    try {
      await this.authAdapter.addProviderToUser(
        user.userId,
        input.provider,
        input.providerUserId,
      );

      await this.userRepository.persistAndFlush(user);
    } catch (e) {
      await this.rollbackUser(user.userId);

      throw e;
    }

    return user;
  }

  public async rollbackUser(userId: string): Promise<void> {
    await this.authAdapter.deleteUser(userId);
    await this.userRepository.nativeDelete({ userId });
  }
}
