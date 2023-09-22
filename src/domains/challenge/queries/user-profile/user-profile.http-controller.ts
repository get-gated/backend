import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';

import { UserProfileQuery } from './user-profile.query';
import { UserProfileResponseDto } from './user-profile.response.dto';
import { UserProfileQueryHandlerResponse } from './user-profile.query-handler';

@Controller()
export class UserProfileHttpController {
  constructor(private queryBus: QueryBus) {}

  @Get('/donation-requests/user/:userId')
  @Allow(SpecialRole.Unauthenticated)
  async featuredRequests(
    @Param('userId') userId: string,
  ): Promise<UserProfileResponseDto> {
    const res: UserProfileQueryHandlerResponse = await this.queryBus.execute(
      new UserProfileQuery(userId),
    );

    return {
      featured: res.featuredRequests.map((item) => ({
        cta: item.cta ?? '',
        donationRequestId: item.donationRequestId,
      })),
      nonprofit: {
        name: res.userSettings.nonprofit.name,
        description: res.userSettings.nonprofit.description,
        nonprofitId: res.userSettings.nonprofit.nonprofitId,
      },
      nonprofitReason: res.userSettings.nonprofitReason ?? '',
    };
  }
}
