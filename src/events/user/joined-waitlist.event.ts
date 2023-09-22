import { Event } from '@app/modules/event-bus';

@Event('JoinedWaitlist')
export class JoinedWaitlistEvent {
  public readonly emailAddress: string;

  constructor(message: JoinedWaitlistEvent) {
    this.emailAddress = message.emailAddress;
  }
}
