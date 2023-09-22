import { Event } from '@app/modules/event-bus';
import { ProviderCheckInterface } from '@app/interfaces/service-provider/provider-check.interface';

@Event('EmailProviderChecked')
export class EmailProviderCheckedEvent extends ProviderCheckInterface {
  constructor(message: EmailProviderCheckedEvent) {
    super(message);
  }
}
