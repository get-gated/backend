import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

export class EvaluateMessageQuery {
  constructor(public readonly message: ConnectionEmailMessageInterface) {}
}
