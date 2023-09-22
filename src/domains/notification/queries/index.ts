import { NotificationsHandler } from './notifications/notifications.handler';
import { NotificationsGraphqlResolver } from './notifications/notifications.graphql-resolver';
import { UserSettingsGraphqlResolver } from './user-settings/user-settings.graphql-resolver';
import { UserSettingsQueryHandler } from './user-settings/user-settings.query-handler';
import { UserSettingsUserGraphqlResolver } from './user-settings/user-settings.user.graphql-resolver';

export default [
  NotificationsHandler,
  NotificationsGraphqlResolver,
  UserSettingsGraphqlResolver,
  UserSettingsQueryHandler,
  UserSettingsUserGraphqlResolver,
];
