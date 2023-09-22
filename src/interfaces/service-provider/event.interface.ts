import { ParticipantInterface } from '@app/interfaces/service-provider/participant.interface';

export class ConnectionCalendarEventInterface {
  public readonly isUserOrganizer: boolean;

  public readonly participants: ParticipantInterface[];

  constructor(props: ConnectionCalendarEventInterface) {
    this.isUserOrganizer = props.isUserOrganizer;
    this.participants = props.participants;
  }
}
