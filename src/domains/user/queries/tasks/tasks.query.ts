export class TasksQuery {
  constructor(
    public readonly userId: string,
    public readonly onlyUnresolved?: boolean,
  ) {}
}
