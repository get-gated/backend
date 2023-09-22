import { Event } from '@app/modules/event-bus';
import { UserInterface } from '@app/interfaces/user/user.interface';

@Event('UserSignupCompleted')
export class UserSignupCompletedEvent extends UserInterface {
  public override readonly userId: string;

  public readonly fullName: string;

  public readonly referredByUserId?: string;

  constructor(message: UserSignupCompletedEvent) {
    super(message);
    this.userId = message.userId;
    this.fullName = message.fullName;
    this.referredByUserId = message.referredByUserId;
  }
}
