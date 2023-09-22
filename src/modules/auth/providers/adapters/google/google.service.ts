/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { google } from 'googleapis';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import AuthConfig from '@app/modules/auth/auth.config';
import {
  AuthCookie,
  AuthRequestDto,
  AuthType,
  OauthReturnRequestDto,
  Provider,
} from '@app/modules/auth';
import OAuthFlowCancelledError from '@app/modules/auth/errors/oauth-flow-cancelled.error';
import { UtilsService } from '@app/modules/utils';
import { CryptoService } from '@app/modules/crypto';
import { LoggerService } from '@app/modules/logger';
import { IAuthResponse, IServerState } from '@app/modules/auth/auth.types';
import { AuthService } from '@app/modules/auth/auth.service';
import InsufficientScopesError from '@app/errors/service-provider/insufficient-scopes.error';
import { InvalidCsrfTokenError } from '@app/modules/auth/errors/invalid-csrf-token.error';

import { AuthAdapterInterface } from '../../auth.adapter.interface';

import {
  LoginScopes,
  ServiceProviderConnectionScopes,
  SettingsScopes,
  SignupLightScopes,
} from './google.constants';
import { GoogleScope as Scope } from './google.enums';

interface TokenInfo {
  grantedScopes: Scope[];
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiration: Date;
}

@Injectable()
export class GoogleService implements AuthAdapterInterface {
  constructor(
    @Inject(AuthConfig.KEY)
    private config: ConfigType<typeof AuthConfig>,
    private log: LoggerService,
    private cryptoService: CryptoService,
    private utils: UtilsService,
    private authService: AuthService,
  ) {}

  // not sure what the proper return type is here
  // typeof google.auth.OAuth2  doesn't work
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private oAuth2Client(redirectUri: string): any {
    const fullRedirectUri = this.utils.apiUrl(redirectUri).toString();
    return new google.auth.OAuth2(
      this.config.google.clientId,
      this.config.google.clientSecret,
      fullRedirectUri,
    );
  }

  private checkScopes(
    scopes: Scope[],
    authType: AuthType,
  ): void | InsufficientScopesError {
    const neededScopes = this.getScopesForAuthType(authType);

    for (let i = 0; i < neededScopes.length; i++) {
      if (!scopes.includes(neededScopes[i])) {
        return new InsufficientScopesError(
          `Insufficient scopes for ${authType}. Missing ${neededScopes[i]}.`,
        );
      }
    }
  }

  private getScopesForAuthType(authType: AuthType): Scope[] {
    let scope: Scope[];
    switch (authType) {
      case AuthType.Login:
        scope = LoginScopes;
        break;
      case AuthType.Signup:
        scope = SignupLightScopes;
        break;
      case AuthType.InboxAccess:
        scope = ServiceProviderConnectionScopes;
        break;
      case AuthType.Signature:
        scope = SettingsScopes;
        break;
      default:
        throw new Error('Unsupported auth type');
    }
    return scope;
  }

  private async getTokensFromCode(
    redirectUri: string,
    code: string,
  ): Promise<TokenInfo> {
    const oAuth2Client = this.oAuth2Client(redirectUri);

    const { tokens, res: tokenRes } = await oAuth2Client.getToken(code);
    this.log.debug({ tokenRes }, 'Received response');

    if (tokenRes.data.error) {
      this.log.error(
        { error: tokenRes.data.error },
        'Error authorizing oauth request',
      );
      throw new Error(tokenRes.data.error);
    }

    this.log.debug({ tokens }, 'Received token');

    // determine the granted scopes and map to our enum
    const grantedScopes: Scope[] = tokenRes.data.scope
      .split(' ')
      .map((scope: string) => scope);

    return {
      grantedScopes,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      expiration: new Date(tokens.expiry_date),
    };
  }

  public async authUrl(
    res: Response,
    redirectUri: string,
    type: AuthType,
    authRequest: AuthRequestDto,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    additionalServerState?: any,
  ): Promise<string> {
    const csrfTokenKey = this.authService.generateCsrfTokenKey();

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // remove any previous auth cookies
    res.clearCookie(AuthCookie.Error);
    res.clearCookie(AuthCookie.State);
    res.clearCookie(AuthCookie.CustomToken);

    res.cookie(csrfTokenKey, '1', {
      httpOnly: true,
      expires,
    });

    const serverState: IServerState = {
      ...additionalServerState,
      provider: authRequest.provider,
      redirect: authRequest.redirect,
      csrfTokenKey,
      defaultNonprofitId: authRequest.defaultNonprofitId,
    };

    const encodedState = this.authService.encodeState(
      authRequest.clientState,
      serverState,
      type,
    );

    const scope = this.getScopesForAuthType(type);

    return this.oAuth2Client(redirectUri).generateAuthUrl({
      access_type: 'offline',
      scope,
      prompt: 'consent',
      state: encodedState,
      redirect_uri: this.utils.apiUrl(redirectUri).toString(),
      include_granted_scopes: false,
      login_hint: authRequest.loginHint,
    });
  }

  public async auth<AdditionalServerState>(
    req: Request,
    res: Response,
    redirectUri: string,
    params: OauthReturnRequestDto,
  ): Promise<IAuthResponse<AdditionalServerState>> {
    this.log.info('Authorizing google oauth request');
    const { error, code, state } = params;
    if ((error && error === 'access_denied') || !code) {
      throw new OAuthFlowCancelledError();
    }

    const { grantedScopes, accessToken, refreshToken, idToken, expiration } =
      await this.getTokensFromCode(redirectUri, code);

    const decodedState =
      this.authService.decodeState<AdditionalServerState>(state);

    const serverStateToken = decodedState.server.csrfTokenKey;
    const cookieToken = req.cookies[serverStateToken];

    if (!cookieToken) {
      this.log.warn('CSRF check failed');
      throw new InvalidCsrfTokenError();
    }

    res.clearCookie(cookieToken);

    const insufficientScopes = this.checkScopes(
      grantedScopes,
      decodedState.type,
    );

    this.log.debug(
      {
        accessToken,
        refreshToken,
        grantedScopes,
        state,
      },
      'Processed tokens and scopes',
    );

    this.log.debug({ accessToken }, 'Getting users profile info');

    const oauth2ProfileClient = new google.auth.OAuth2(); // create new auth client

    oauth2ProfileClient.setCredentials({ access_token: accessToken }); // use the new auth client with the access_token

    const { data } = await google
      .oauth2({
        auth: oauth2ProfileClient,
        version: 'v2',
      })
      .userinfo.get();

    return {
      emailAddress: data.email ?? '',
      grantedScopes,
      refreshToken: await this.cryptoService.encrypt(refreshToken),
      accessToken: await this.cryptoService.encrypt(accessToken),
      idToken,
      expiration,
      provider: Provider.Google,
      clientState: decodedState.client,
      serverState: decodedState.server,
      insufficientScopes,
      firstName: data.given_name ?? '',
      lastName: data.family_name ?? '',
      sub: data.id ?? '',
      avatar: data.picture ?? '',
    };
  }

  public async getProviderUserIdFromIdToken(
    idToken: string,
  ): Promise<string | undefined> {
    const client = new google.auth.OAuth2(); // create new auth client

    const ticket = await client.verifyIdToken({
      idToken,
      audience: this.config.google.allowedClientIds,
    });

    const payload = ticket.getPayload();
    return payload?.sub;
  }
}
