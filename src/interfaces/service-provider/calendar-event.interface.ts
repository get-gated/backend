import { Provider } from '@app/interfaces/service-provider/service-provider.enums';
import { ParticipantInterface } from '@app/interfaces/service-provider/participant.interface';

export abstract class CalendarEventInterface {
  readonly userId: string;

  readonly connectionId: string;

  readonly provider: Provider;

  readonly participants: ParticipantInterface[];

  constructor(props: CalendarEventInterface) {
    this.userId = props.userId;
    this.connectionId = props.connectionId;
    this.provider = props.provider;
    this.participants = props.participants;
  }
}
