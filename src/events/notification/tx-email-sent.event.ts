import { Event } from '@app/modules/event-bus';
import { TxEmailInterface } from '@app/interfaces/notification/tx-email.interface';

@Event('TxEmailSent')
export class TxEmailSentEvent extends TxEmailInterface {
  constructor(message: TxEmailInterface) {
    super(message);
  }
}
