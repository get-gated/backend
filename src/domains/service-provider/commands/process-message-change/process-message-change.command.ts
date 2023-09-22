import { MessageChangeInterface } from '@app/interfaces/service-provider/message-change.interface';

export class ProcessMessageChangeCommand {
  constructor(public readonly change: MessageChangeInterface) {}
}
