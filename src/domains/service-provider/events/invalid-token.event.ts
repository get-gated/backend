import { Event } from '@app/modules/event-bus';

@Event('InvalidToken')
export class InvalidTokenEvent {
  public readonly connectionId: string;

  constructor(message: InvalidTokenEvent) {
    this.connectionId = message.connectionId;
  }
}
