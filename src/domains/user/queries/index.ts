import { UserHandler } from './user/user.handler';
import { UserGraphqlResolver } from './user/user.graphql-resolver';
import { SearchUsersGraphqlResolver } from './search-users/search-users.graphql-resolver';
import { SearchUsersQueryHandler } from './search-users/search-users.query-handler';
import { TasksQueryHandler } from './tasks/tasks.query-handler';
import { TaskQueryHandler } from './task/task.query-handler';
import { TasksGraphqlResolver } from './tasks/tasks.graphql-resolver';
import { NetworkConnectionStatsGraphqlResolver } from './network-connection-stats/network-connection-stats.graphql-resolver';
import { NetworkConnectionsQueryHandler } from './network-connections/network-connections.query-handler';
import { NetworkConnectionStatsQueryHandler } from './network-connection-stats/network-connection-stats.query-handler';
import { NetworkConnectionsGraphqlResolver } from './network-connections/network-connections.graphql-resolver';
import { UserByHandleHandler } from './user-by-handle/user-by-handle.handler';
import { HandleAvailableGraphqlResolver } from './handle-available/handle-available.graphql-resolver';
import { HandleAvailableQueryHandler } from './handle-available/handle-available.query-handler';
import { UserByHandleHttpController } from './user-by-handle/user-by-handle.http-controller';

export const providers = [
  UserHandler,
  UserGraphqlResolver,
  SearchUsersGraphqlResolver,
  SearchUsersQueryHandler,
  TasksQueryHandler,
  TasksGraphqlResolver,
  TaskQueryHandler,
  NetworkConnectionStatsGraphqlResolver,
  NetworkConnectionStatsQueryHandler,
  NetworkConnectionsQueryHandler,
  NetworkConnectionsGraphqlResolver,
  UserByHandleHandler,
  HandleAvailableGraphqlResolver,
  HandleAvailableQueryHandler,
];

export const controllers = [UserByHandleHttpController];
