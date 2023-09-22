import { Event } from '@app/modules/event-bus';
import { UserTaskInterface } from '@app/interfaces/user/user-task.interface';

/**
 * Indicates a user task, that should be completed, is considered pending.
 */
@Event('UserTaskPending')
export class UserTaskPendingEvent extends UserTaskInterface {
  public readonly userId: string;

  constructor(message: UserTaskPendingEvent) {
    super(message);
    this.userId = message.userId;
  }
}
