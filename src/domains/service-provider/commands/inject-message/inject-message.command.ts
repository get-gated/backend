import { InjectMessageInterface } from '@app/interfaces/service-provider/inject-message.interface';

export class InjectMessageCommand {
  constructor(public readonly message: InjectMessageInterface) {}
}
