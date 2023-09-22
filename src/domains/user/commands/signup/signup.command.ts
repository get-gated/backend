import { IAuthResponse } from '@app/modules/auth';

export class SignupCommand {
  constructor(
    public readonly providerUser: IAuthResponse,
    public readonly defaultNonprofitId?: string,
    public readonly referralCode?: string,
  ) {}
}
