import { IAuthResponse } from '@app/modules/auth';

export class LoginCommand {
  constructor(public readonly providerUser: IAuthResponse) {}
}
