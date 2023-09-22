import { AuthType, Provider } from '@app/modules/auth/auth.enums';
import InsufficientScopesError from '@app/errors/service-provider/insufficient-scopes.error';

export interface IServerState {
  provider: Provider;
  redirect: string;
  csrfTokenKey: string;
  defaultNonprofitId?: string;
}

export interface IState<AdditionalServerState> {
  type: AuthType;
  client: string;
  server: IServerState & AdditionalServerState;
}

export interface IAuthResponse<AdditionalServerState = any> {
  emailAddress: string;
  grantedScopes: string[];
  refreshToken: string;
  accessToken: string;
  expiration: Date;
  firstName: string;
  lastName: string;
  sub: string;
  idToken: string;
  provider: Provider;
  avatar: string;
  clientState: string;
  serverState: IServerState & AdditionalServerState;
  insufficientScopes: void | InsufficientScopesError;
}
