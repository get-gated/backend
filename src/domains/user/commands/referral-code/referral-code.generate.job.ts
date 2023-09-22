/* eslint-disable no-await-in-loop */
import { IJob, Job } from '@app/modules/job';
import { CommandBus } from '@nestjs/cqrs';

import UserRepository from '../../entities/repositories/user.repository';

import { ReferralCodeCommand } from './referral-code.command';

/**
 * Temporary job to generate referral codes for historical users. can be deleted when executed
 */
@Job('ReferralCodeGenerateJob')
export class ReferralCodeGenerateJob implements IJob {
  constructor(
    private userRepository: UserRepository,
    private commandBus: CommandBus,
  ) {}

  async run(): Promise<void> {
    const users = await this.userRepository.find({ referralCode: null });

    for (let i = 0; i < users.length; i++) {
      await this.commandBus.execute(new ReferralCodeCommand(users[i].userId));
    }
  }
}
