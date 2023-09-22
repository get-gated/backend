import { Event } from '@app/modules/event-bus';
import { UserTaskInterface } from '@app/interfaces/user/user-task.interface';

@Event('UserTaskResolved')
export class UserTaskResolvedEvent extends UserTaskInterface {
  public readonly userId: string;

  constructor(message: UserTaskResolvedEvent) {
    super(message);
    this.userId = message.userId;
  }
}
