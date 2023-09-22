import { ConnectionRemovedTrigger } from '@app/interfaces/service-provider/service-provider.enums';

export class RemoveConnectionCommand {
  constructor(
    public readonly userId: string,
    public readonly connectionId: string,
    public readonly trigger: ConnectionRemovedTrigger,
    public readonly reasonText?: string,
    public readonly experienceText?: string,
  ) {}
}
