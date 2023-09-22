import { Event } from '@app/modules/event-bus';
import { NotificationUserSettingInterface } from '@app/interfaces/notification/user-setting.interface';

@Event('NotificationUserSettingsUpdated')
export class NotificationUserSettingsUpdatedEvent extends NotificationUserSettingInterface {
  constructor(props: NotificationUserSettingInterface) {
    super(props);
  }
}
