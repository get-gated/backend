import { Event } from '@app/modules/event-bus';
import { UserTaskInterface } from '@app/interfaces/user/user-task.interface';

@Event('UserTaskCreated')
export class UserTaskCreatedEvent extends UserTaskInterface {
  public readonly userId: string;

  constructor(message: UserTaskCreatedEvent) {
    super(message);
    this.userId = message.userId;
  }
}
