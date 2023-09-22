/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable class-methods-use-this */
import { Inject, Injectable } from '@nestjs/common';
import { IServerState, IState } from '@app/modules/auth/auth.types';
import { AuthCookie, AuthType } from '@app/modules/auth/auth.enums';
import { isURL } from 'class-validator';
import { BadOauthStateError } from '@app/modules/auth/identity/auth.adapter';
import AuthConfig from '@app/modules/auth/auth.config';
import { ConfigType } from '@nestjs/config';
import { UnallowedRedirectError } from '@app/modules/auth/errors/unallowed-redirect.error';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthConfig.KEY) private config: ConfigType<typeof AuthConfig>,
  ) {}

  public redirectUrlIsAllowed(url: string): boolean {
    const isAllowed = isURL(url, {
      host_whitelist: this.config.allowedHostRedirectHosts,
      require_tld: false,
    });
    if (!isAllowed) {
      throw new UnallowedRedirectError();
    }
    return true;
  }

  public generateCsrfToken(): string {
    return uuidv4();
  }

  public generateCsrfTokenKey(): string {
    return `${AuthCookie.CsrfToken}_${uuidv4()}`;
  }

  public encodeState(
    clientState: string,
    serverState: IServerState,
    type: AuthType,
  ): string {
    this.redirectUrlIsAllowed(serverState.redirect);

    return Buffer.from(
      JSON.stringify({
        client: clientState,
        server: serverState,
        type,
      }),
    ).toString('base64');
  }

  public decodeState<AdditionalServerState>(
    stateString: string,
  ): IState<AdditionalServerState> {
    try {
      return JSON.parse(Buffer.from(stateString, 'base64').toString('ascii'));
    } catch (error) {
      throw new BadOauthStateError();
    }
  }
}
