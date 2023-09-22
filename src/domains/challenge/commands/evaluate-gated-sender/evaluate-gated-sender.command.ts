import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

export class EvaluateGatedSenderCommand {
  constructor(
    public readonly connectionId: string,
    public readonly threadId: string,
    public readonly message: ConnectionEmailMessageInterface,
    public readonly userId: string,
    public readonly to: string,
  ) {}
}
