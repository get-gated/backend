import { MoveThreadDestination } from '@app/interfaces/service-provider/service-provider.enums';

export class MoveThreadCommand {
  constructor(
    public readonly connectionId: string,
    public readonly threadId: string,
    public readonly destination: MoveThreadDestination,
  ) {}
}
