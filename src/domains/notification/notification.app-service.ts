import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { NotificationUserSettingsQuery } from './queries/user-settings/user-settings.query';

@Injectable()
export class NotificationAppService {
  constructor(private queryBus: QueryBus) {}

  public async queryUserSettings(input: NotificationUserSettingsQuery) {
    return this.queryBus.execute(
      new NotificationUserSettingsQuery(input.userId),
    );
  }
}
