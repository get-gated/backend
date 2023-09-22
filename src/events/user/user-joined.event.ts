import { Event } from '@app/modules/event-bus';
import { UserInterface } from '@app/interfaces/user/user.interface';

@Event('UserJoined')
export class UserJoinedEvent extends UserInterface {
  public readonly fullName: string;
  public readonly joinedWithEmail: string;
  public readonly defaultNonprofitId?: string;
  public readonly defaultMinimumDonationInCents?: number;
  public readonly referredByUserId?: string;
  constructor(message: UserJoinedEvent) {
    super(message);
    this.fullName = message.fullName;
    this.joinedWithEmail = message.joinedWithEmail;
    this.defaultNonprofitId = message.defaultNonprofitId;
    this.defaultMinimumDonationInCents = message.defaultMinimumDonationInCents;
    this.referredByUserId = message.referredByUserId;
  }
}
