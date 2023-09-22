import { UserTask, UserTaskResolution } from '@app/interfaces/user/user.enums';

export class ResolveTaskCommand {
  constructor(
    public readonly userId: string,
    public readonly task: UserTask,
    public readonly resolution: UserTaskResolution,
  ) {}
}
