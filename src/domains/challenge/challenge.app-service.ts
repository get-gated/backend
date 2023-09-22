import { Injectable } from '@nestjs/common';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';
import { QueryBus } from '@nestjs/cqrs';
import ChallengeUserSettingsInterface from '@app/interfaces/challenge/challenge-user-settings.interface';

import { ChallengeHasInteractionQuery } from './queries/challenge-has-interaction/challenge-has-interaction.query';
import { DonationOrBypassByThreadIdQuery } from './queries/donation-or-bypass-by-thread-id/donation-or-bypass-by-thread-id.query';
import { ChallengeUserSettingsQuery } from './queries/user-settings/user-settings.query';

@Injectable()
export default class ChallengeAppService {
  constructor(private queryBus: QueryBus) {}

  public async queryChallengeHasInteraction(
    challengeId: string,
    interaction: ChallengeInteraction,
  ): Promise<any> {
    return this.queryBus.execute(
      new ChallengeHasInteractionQuery(challengeId, interaction),
    );
  }

  public async donationOrBypassByThreadId(
    input: DonationOrBypassByThreadIdQuery,
  ): Promise<any> {
    return this.queryBus.execute(
      new DonationOrBypassByThreadIdQuery(input.userId, input.threadId),
    );
  }

  public async queryChallengeUserSettings(
    input: ChallengeUserSettingsQuery,
  ): Promise<ChallengeUserSettingsInterface> {
    return this.queryBus.execute(new ChallengeUserSettingsQuery(input.userId));
  }
}
