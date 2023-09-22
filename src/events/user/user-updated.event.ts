import { Event } from '@app/modules/event-bus';
import { UserInterface } from '@app/interfaces/user/user.interface';

@Event('UserUpdated')
export class UserUpdatedEvent extends UserInterface {
  public readonly fullName: string;

  public readonly referredByUserId?: string;

  constructor(message: UserUpdatedEvent) {
    super(message);
    this.fullName = message.fullName;
    this.referredByUserId = message.referredByUserId;
  }
}
