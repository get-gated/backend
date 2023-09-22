import { promises as dns } from 'dns';

import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { UtilsService } from '@app/modules/utils';
import { EmailProviderCheckedEvent } from '@app/events/service-provider/email-provider-checked.event';

import { EmailProviderIsGoogleQuery } from './email-provider-is-google.query';

@QueryHandler(EmailProviderIsGoogleQuery)
export class EmailProviderIsGoogleQueryHandler
  implements ICommandHandler<EmailProviderIsGoogleQuery>
{
  constructor(private eventBus: EventBusService, private utils: UtilsService) {}

  async execute(command: EmailProviderIsGoogleQuery): Promise<boolean> {
    const { emailAddress } = command;

    const { domain } = this.utils.deconstructEmailAddress(emailAddress);

    let isGoogle = false;

    const mxResults = await dns.resolveMx(domain);
    for (let i = 0; i < mxResults.length; i++) {
      if (mxResults[i].exchange.toLocaleLowerCase().includes('google.com')) {
        isGoogle = true;
        break;
      }
    }

    await this.eventBus.publish(
      new EmailProviderCheckedEvent({
        emailAddress,
        isGoogle,
      }),
    );

    return isGoogle;
  }
}
