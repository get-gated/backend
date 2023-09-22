import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';

export interface IMessagesQueryFilter {
  email?: string;
  type?: MessageType;
  after?: Date;
  before?: Date;
}

export class MessagesQuery {
  constructor(
    public readonly userId: string,
    public readonly limit: number = 50,
    public readonly offset: number = 0,
    public readonly filter?: IMessagesQueryFilter,
    public readonly includePreGated = false,
  ) {}
}
