import { PushData } from '../../services/push/push.adapter';

export class SendPushCommand {
  constructor(
    public readonly userId: string,
    public readonly body: string,
    public readonly data?: PushData,
  ) {}
}
