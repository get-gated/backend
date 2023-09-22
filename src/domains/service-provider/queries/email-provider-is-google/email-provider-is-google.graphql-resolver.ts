import { Args, Query, Resolver } from '@nestjs/graphql';
import { Allow, SpecialRole } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import { EmailProviderIsGoogleResponseDto } from './email-provider-is-google.response.dto';
import { EmailProviderIsGoogleQuery } from './email-provider-is-google.query';
import { EmailProviderIsGoogleRequestDto } from './email-provider-is-google.request.dto';

@Resolver()
export class EmailProviderIsGoogleGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => EmailProviderIsGoogleResponseDto)
  @Allow(SpecialRole.Unauthenticated)
  async providerFromAddress(
    @Args('input') { emailAddress }: EmailProviderIsGoogleRequestDto,
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
