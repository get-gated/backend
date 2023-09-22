import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

export class TrackSentReceivedCommand {
  constructor(public readonly message: ConnectionEmailMessageInterface) {}
}
