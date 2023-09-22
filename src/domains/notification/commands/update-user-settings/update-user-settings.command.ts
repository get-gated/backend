import { Transaction } from '@app/interfaces/notification/notification.enums';

export class UpdateUserSettingsCommand {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly disableTxEmail?: Transaction[],
  ) {}
}
