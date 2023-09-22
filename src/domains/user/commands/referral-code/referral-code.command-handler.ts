import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import UserRepository from '../../entities/repositories/user.repository';
import { generateReferralCode } from '../../user.utils';

import { ReferralCodeCommand } from './referral-code.command';

@CommandHandler(ReferralCodeCommand)
export class ReferralCodeCommandHandler
  implements ICommandHandler<ReferralCodeCommand>
{
  constructor(private userRepository: UserRepository) {}

  async execute(command: ReferralCodeCommand): Promise<any> {
    const getUniqueCode = async (): Promise<string> => {
      const referralCode = generateReferralCode(5);
      const exists = await this.userRepository.findOne({ referralCode });
      if (exists) return getUniqueCode();
      return referralCode;
    };

    const user = await this.userRepository.findOneOrFail(command.userId);
    const code = await getUniqueCode();
    user.referralCode = code;
    await this.userRepository.persistAndFlush(user);
  }
}
