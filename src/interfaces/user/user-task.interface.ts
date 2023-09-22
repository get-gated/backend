import { UserTask, UserTaskResolution } from '@app/interfaces/user/user.enums';

export abstract class UserTaskInterface {
  public readonly taskId: string;

  abstract userId: string;

  public readonly task: UserTask;

  public readonly createdAt: Date;

  public readonly resolvedAt?: Date;

  public readonly resolution?: UserTaskResolution;

  constructor(props: UserTaskInterface) {
    this.taskId = props.taskId;
    this.task = props.task;
    this.createdAt = props.createdAt && new Date(props.createdAt);
    this.resolvedAt = props.resolvedAt && new Date(props.resolvedAt);
    this.resolution = props.resolution;
  }
}
