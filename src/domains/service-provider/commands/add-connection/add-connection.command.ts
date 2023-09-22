import { Provider } from '@app/interfaces/service-provider/service-provider.enums';

export class AddConnectionCommand {
  constructor(
    public readonly userId: string,
    public readonly providerUserId: string,
    public readonly provider: Provider,
    public readonly providerToken: string,

    public readonly providerEmailAddress: string,
    public readonly legacyConnectionId?: string,
  ) {}
}
