import { Status } from '@app/interfaces/service-provider/service-provider.enums';

export class ConnectionStatusCommand {
  constructor(
    public readonly connectionId: string,
    public readonly status: Status,
  ) {}
}
