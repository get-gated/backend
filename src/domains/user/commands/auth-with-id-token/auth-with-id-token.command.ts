import { Provider } from '@app/modules/auth';

export class AuthWithIdTokenCommand {
  constructor(
    public readonly idToken: string,
    public readonly provider: Provider,
  ) {}
}
