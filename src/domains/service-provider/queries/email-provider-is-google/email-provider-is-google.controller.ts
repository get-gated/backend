import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';

import { EmailProviderIsGoogleQuery } from './email-provider-is-google.query';
import { EmailProviderIsGoogleResponseDto } from './email-provider-is-google.response.dto';

@Controller()
@Injectable()
export class EmailProviderIsGoogleController {
  constructor(private queryBus: QueryBus) {}

  static route = 'service-provider/is-google';

  @Get(EmailProviderIsGoogleController.route)
  @Allow(SpecialRole.Unauthenticated)
  async getProvider(
    @Query('emailAddress') emailAddress: string,
  ): Promise<EmailProviderIsGoogleResponseDto> {
    const isGoogle = await this.queryBus.execute(
      new EmailProviderIsGoogleQuery(emailAddress),
    );
    return {
      emailAddress,
      isGoogle,
    };
  }
}
