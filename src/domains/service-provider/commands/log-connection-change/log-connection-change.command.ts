import { Status } from '@app/interfaces/service-provider/service-provider.enums';

export class LogConnectionChangeCommand {
  constructor(
    public readonly connectionId: string,
    public readonly status: Status,
    public readonly isActivated: boolean,
  ) {}
}
