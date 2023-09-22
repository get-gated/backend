import { UserTask } from '@app/interfaces/user/user.enums';

export class CreateTaskCommand {
  constructor(public readonly userId: string, public readonly task: UserTask) {}
}
