import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

export class EvaluateMessageCommand {
  constructor(public readonly message: ConnectionEmailMessageInterface) {}
}
