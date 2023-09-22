// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import {
  AuthRequestDto,
  AuthType,
  OauthReturnRequestDto,
} from '@app/modules/auth';
import { IAuthResponse } from '@app/modules/auth/auth.types';

export interface AuthAdapterInterface {
  authUrl(
    res: Response,
    redirectUri: string,
    type: AuthType,
    authRequest: AuthRequestDto,
    additionalServerState?: any,
  ): Promise<string>;
  auth<AdditionalServerState>(
    req: Request,
    res: Response,
    redirectUri: string,
    params: OauthReturnRequestDto,
  ): Promise<IAuthResponse<AdditionalServerState>>;
  getProviderUserIdFromIdToken(idToken: string): Promise<string | undefined>;
}
