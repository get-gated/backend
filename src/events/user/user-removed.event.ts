import { Event } from '@app/modules/event-bus';
import { UserInterface } from '@app/interfaces/user/user.interface';

@Event('UserRemoved')
export class UserRemovedEvent extends UserInterface {
  public readonly fullName: string;

  public readonly reasonText: string;

  public readonly experienceText: string;

  public readonly referredByUserId?: string;

  constructor(message: UserRemovedEvent) {
    super(message);
    this.fullName = message.fullName;
    this.reasonText = message.reasonText || '';
    this.experienceText = message.experienceText || '';
    this.referredByUserId = message.referredByUserId;
  }
}
