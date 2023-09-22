import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import DonationRequestEntity from '../../entities/donation-request.entity';
import ChallengeUserSettingEntity from '../../entities/user-setting.entity';

import { UserProfileQuery } from './user-profile.query';

export interface UserProfileQueryHandlerResponse {
  userSettings: ChallengeUserSettingEntity;
  featuredRequests: DonationRequestEntity[];
}

@QueryHandler(UserProfileQuery)
export class UserProfileQueryHandler
  implements IQueryHandler<UserProfileQuery, UserProfileQueryHandlerResponse>
{
  constructor(
    @InjectRepository(DonationRequestEntity)
    private donationReqRepo: EntityRepository<DonationRequestEntity>,
    @InjectRepository(ChallengeUserSettingEntity)
    private userSettingsRepo: EntityRepository<ChallengeUserSettingEntity>,
  ) {}

  async execute(
    query: UserProfileQuery,
  ): Promise<UserProfileQueryHandlerResponse> {
    const { userId } = query;
    const featuredRequests = await this.donationReqRepo.find({
      userId,
      isFeatured: true,
      isActive: true,
      deletedAt: null,
    });

    const userSettings = await this.userSettingsRepo.findOneOrFail({
      userId,
    });

    return { userSettings, featuredRequests };
  }
}
