import { AddConnectionHttpController } from '../../service-provider/commands/add-connection/add-connection.http.controller';

import { LoginHttpController } from './login/login.http.controller';
import { SignupHttpController } from './signup/signup.http.controller';
import { LogoutHttpController } from './logout/logout.http.controller';
import { LoginHandler } from './login/login.handler';
import { SignupHandler } from './signup/signup.handler';
import { UpdateUserCommandHandler } from './update-user/update-user.command-handler';
import { UpdateUserGraphqlResolver } from './update-user/update-user.graphql-resolver';
import { UpdateUserRolesGraphqlResolver } from './update-user-roles/update-user-roles.graphql-resolver';
import { UpdateUserRolesCommandHandler } from './update-user-roles/update-user-roles.command-handler';
import { UpdateUserPersonalizationGraphqlResolver } from './update-user-personalization/update-user-personalization.graphql-resolver';
import { UpdateUserPersonalizationCommandHandler } from './update-user-personalization/update-user-personalization.command-handler';
import { CreateTaskCommandHandler } from './create-task/create-task.command-handler';
import { ResolveTaskCommandHandler } from './resolve-task/resolve-task.command-handler';
import { ResolveTaskGraphqlResolver } from './resolve-task/resolve-task.graphql-resolver';
import UserSettingsUserJoinedEventHandler from './create-task/create-task.user-joined.event-handler';
import { MarkSignupCompletedCommandHandler } from './mark-signup-completed/mark-signup-completed.command-handler';
import { MarkSignupCompletedConnectionChangedEventHandler } from './mark-signup-completed/mark-signup-completed.connection-changed.event-handler';
import { JoinWaitlistHandler } from './join-waitlist/join-waitlist.handler';
import { JoinWaitlistHttpController } from './join-waitlist/join-waitlist.http.controller';
import { OffboardGraphqlResolver } from './offboard/offboard.graphql-resolver';
import { OffboardCommandHandler } from './offboard/offboard.command-handler';
import { MarkSignupCompletedConnectionAddedEventHandler } from './mark-signup-completed/mark-signup-completed.connection-added.event-handler';
import { AddNetworkConnectionCommandHandler } from './add-network-connection/add-network-connection.command-handler';
import { AddNetworkConnectionMessageCreatedEventHandler } from './add-network-connection/add-network-connection.message-created.event-handler';
import { ReferralCodeGenerateJob } from './referral-code/referral-code.generate.job';
import { ReferralCodeCommandHandler } from './referral-code/referral-code.command-handler';
import { ReferralCodeUserJoinedEventHandler } from './referral-code/referral-code.user-joined.event-handler';
import { AddNetworkConnectionsUserJoinedEventHandler } from './add-network-connection/add-network-connections.user-joined.event-handler';
import { PendingTasksJob } from './pending-tasks/pending-tasks.job';
import { HandleCommandHandler } from './handle/handle.command-handler';
import { HandleGraphqlResolver } from './handle/handle.graphql-resolver';
import { AuthWithIdTokenCommandHandler } from './auth-with-id-token/auth-with-id-token.command-handler';
import { AuthWithIdTokenHttpController } from './auth-with-id-token/auth-with-id-token.http-controller';

export const providers = [
  LoginHandler,
  SignupHandler,
  UpdateUserCommandHandler,
  UpdateUserGraphqlResolver,
  UpdateUserRolesGraphqlResolver,
  UpdateUserRolesCommandHandler,
  UpdateUserPersonalizationGraphqlResolver,
  UpdateUserPersonalizationCommandHandler,
  CreateTaskCommandHandler,
  ResolveTaskCommandHandler,
  ResolveTaskGraphqlResolver,
  UserSettingsUserJoinedEventHandler,
  MarkSignupCompletedCommandHandler,
  MarkSignupCompletedConnectionChangedEventHandler,
  MarkSignupCompletedConnectionAddedEventHandler,
  PendingTasksJob,
  JoinWaitlistHandler,
  OffboardGraphqlResolver,
  OffboardCommandHandler,
  AddNetworkConnectionCommandHandler,
  AddNetworkConnectionMessageCreatedEventHandler,
  AddNetworkConnectionsUserJoinedEventHandler,
  ReferralCodeCommandHandler,
  ReferralCodeUserJoinedEventHandler,
  ReferralCodeGenerateJob,
  HandleCommandHandler,
  HandleGraphqlResolver,
  AuthWithIdTokenCommandHandler,
];

export const controllers = [
  AddConnectionHttpController,
  LoginHttpController,
  SignupHttpController,
  LogoutHttpController,
  JoinWaitlistHttpController,
  AuthWithIdTokenHttpController,
];
