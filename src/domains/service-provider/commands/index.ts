import { ConnectionStatusHandler } from './connection-status/connection-status.handler';
import { SendReplyHandler } from './send-reply/send-reply.handler';
import { MoveThreadHandler } from './move-thread/move-thread.handler';
import { ActivateConnectionCommandHandler } from './activate-connection/activate-connection.command-handler';
import { DeactivateConnectionCommandHandler } from './deactivate-connection/deactivate-connection.command-handler';
import { RemoveConnectionCommandHandler } from './remove-connection/remove-connection.command-handler';
import { AddConnectionCommandHandler } from './add-connection/add-connection.command-handler';
import { SyncCommandHandler } from './sync/sync.command-handler';
import ActivateConnectionAddConnectionEventHandler from './activate-connection/activate-connection.add-connection.event-handler';
import { ScheduleSyncConnectionAddedEventHandler } from './schedule-sync/schedule-sync.connection-added.event-handler';
import { ScheduleSyncConnectionChangedEventHandler } from './schedule-sync/schedule-sync.connection-changed.event-handler';
import { SyncScheduledEventHandler } from './sync/sync.sync-scheduled.event-handler';
import MoveThreadChallengeInteractionEventHandler from './move-thread/move-thread.challenge-interaction.event-handler';
import MoveThreadGatekeeperDecisionMadeEventHandler from './move-thread/move-thread.gatekeeper-decision-made.event-handler';
import { ConnectionStatusConnectionAddedEventHandler } from './connection-status/connection-status.connection-added.event-handler';
import { ActivateConnectionGraphqlResolver } from './activate-connection/activate-connection.graphql-resolver';
import { DeactivateConnectionGraphqlResolver } from './deactivate-connection/deactivate-connection.graphql-resolver';
import { RemoveConnectionGraphqlResolver } from './remove-connection/remove-connection.graphql-resolver';
import MoveThreadMessageCreatedEventHandler from './move-thread/move-thread.message-created.event-handler';
import { ReauthorizeConnectionCommandHandler } from './reauthorize-connection/reauthorize-connection.command-handler';
import { SyncJob } from './sync/sync.job';
import { ScheduleSyncJob } from './schedule-sync/schedule-sync.job';
import { ScheduleSyncCommandHandler } from './schedule-sync/schedule-sync.command-handler';
import { ReauthorizeConnectionHttpController } from './reauthorize-connection/reauthorize-connection.http.controller';
import { TrackSentReceivedCommandHandler } from './track-sent-received/track-sent-received.command-handler';
import { TrackSentReceivedMessageCreatedEventHandler } from './track-sent-received/track-sent-received.message-created.event-handler';
import { LogConnectionChangeCommandHandler } from './log-connection-change/log-connection-change.command-handler';
import { LogConnectionChangeConnectionChangedEventHandler } from './log-connection-change/log-connection-change.connection-changed.event-handler';
import { LogConnectionChangeConnectionRemovedEventHandler } from './log-connection-change/log-connection-change.connection-removed.event-handler';
import { LogConnectionChangeConnectionActivatedEventHandler } from './log-connection-change/log-connection-change.connection-activated.event-handler';
import { LogConnectionChangeConnectionAddedEventHandler } from './log-connection-change/log-connection-change.connection-added.event-handler';
import { LogConnectionChangeConnectionDeactivedEventHandler } from './log-connection-change/log-connection-change.connection-deactived.event-handler';
import { RemoveConnectionUserRemovedEventHandler } from './remove-connection/remove-connection.user-removed.event-handler';
import { AnonymizeHistoryCommandHandler } from './anonymize-history/anonymize-history.command-handler';
import { AnonymizeHistoryConnectionRemovedEventHandler } from './anonymize-history/anonymize-history.connection-removed.event-handler';
import { RemoveConnectionScheduledRemovalJob } from './remove-connection/remove-connection.scheduled-removal.job';
import { ScheduleConnectionRemovalCommandHandler } from './schedule-connection-removal/schedule-connection-removal.command-handler';
import { ScheduleConnectionRemovalConnectionChangedEventHandler } from './schedule-connection-removal/schedule-connection-removal.connection-changed.event-handler';
import { UnscheduleConnectionRemovalCommandHandler } from './unschedule-connection-removal/unschedule-connection-removal.command-handler';
import { UnscheduleConnectionRemovalConnectionChangedEventHandler } from './unschedule-connection-removal/unschedule-connection-removal.connection-changed.event-handler';
import { ConnectionStatusGraphqlResolver } from './connection-status/connection-status.graphql-resolver';
import { ConnectionStatusCheckForInvalidJob } from './connection-status/connection-status.check-for-invalid.job';
import { WatchGmailAccountsCommandHandler } from './watch-gmail-accounts/watch-gmail-accounts.command-handler';
import { WatchGmailAccountsJob } from './watch-gmail-accounts/watch-gmail-accounts.job';
import { ProcessGmailHistoryCommandHandler } from './process-gmail-history/process-gmail-history.command-handler';
import { ProcessGmailHistoryGmailPushNotificationEventHandler } from './process-gmail-history/process-gmail-history.gmail-push-notification.event-handler';
import { ProcessMessageChangeEmailMessageChangedEventHandler } from './process-message-change/process-message-change.email-message-changed.event-handler';
import { ProcessMessageChangeCommandHandler } from './process-message-change/process-message-change.command-handler';
import { ChangeManagedByCommandHandler } from './change-managed-by/change-managed-by.command-handler';
import { ChangeManagedByGraphqlResolver } from './change-managed-by/change-managed-by.graphql-resolver';
import MoveThreadMessageLabelsAdded from './move-thread/move-thread.message-labels-added';
import { ProcessGmailHistoryCatchUpJob } from './process-gmail-history/process-gmail-history.catch-up.job';
import { InjectMessageCommandHandler } from './inject-message/inject-message.command-handler';
import { ConnectionStatusInvalidTokenEventHandler } from './connection-status/connection-status.invalid-token.event-handler';
import { AddSignatureHttpController } from './add-signature/add-signature.http.controller';
import { AddSignatureCommandHandler } from './add-signature/add-signature.command-handler';

export const providers = [
  ConnectionStatusHandler,
  ConnectionStatusConnectionAddedEventHandler,
  ConnectionStatusGraphqlResolver,
  ConnectionStatusCheckForInvalidJob,
  // MessageCreatedHandler,
  // MessageUpdatedHandler,
  AddConnectionCommandHandler,
  ActivateConnectionCommandHandler,
  ActivateConnectionGraphqlResolver,
  DeactivateConnectionCommandHandler,
  DeactivateConnectionGraphqlResolver,
  RemoveConnectionCommandHandler,
  RemoveConnectionGraphqlResolver,
  RemoveConnectionUserRemovedEventHandler,
  RemoveConnectionScheduledRemovalJob,
  SendReplyHandler,
  MoveThreadHandler,
  MoveThreadChallengeInteractionEventHandler,
  MoveThreadGatekeeperDecisionMadeEventHandler,
  MoveThreadMessageCreatedEventHandler,
  SyncCommandHandler,
  SyncJob,
  ScheduleSyncJob,
  ScheduleSyncCommandHandler,
  ActivateConnectionAddConnectionEventHandler,
  ScheduleSyncConnectionAddedEventHandler,
  ScheduleSyncConnectionChangedEventHandler,
  SyncScheduledEventHandler,
  ReauthorizeConnectionCommandHandler,
  TrackSentReceivedCommandHandler,
  TrackSentReceivedMessageCreatedEventHandler,
  LogConnectionChangeCommandHandler,
  LogConnectionChangeConnectionChangedEventHandler,
  LogConnectionChangeConnectionRemovedEventHandler,
  LogConnectionChangeConnectionActivatedEventHandler,
  LogConnectionChangeConnectionAddedEventHandler,
  LogConnectionChangeConnectionDeactivedEventHandler,
  AnonymizeHistoryCommandHandler,
  AnonymizeHistoryConnectionRemovedEventHandler,
  ScheduleConnectionRemovalCommandHandler,
  ScheduleConnectionRemovalConnectionChangedEventHandler,
  UnscheduleConnectionRemovalCommandHandler,
  UnscheduleConnectionRemovalConnectionChangedEventHandler,
  WatchGmailAccountsCommandHandler,
  WatchGmailAccountsJob,
  ProcessGmailHistoryCommandHandler,
  ProcessGmailHistoryGmailPushNotificationEventHandler,
  ProcessGmailHistoryCatchUpJob,
  ProcessMessageChangeEmailMessageChangedEventHandler,
  ProcessMessageChangeCommandHandler,
  ChangeManagedByCommandHandler,
  ChangeManagedByGraphqlResolver,
  MoveThreadMessageLabelsAdded,
  InjectMessageCommandHandler,
  ConnectionStatusInvalidTokenEventHandler,
  AddSignatureCommandHandler,
];

export const controllers = [
  ReauthorizeConnectionHttpController,
  AddSignatureHttpController,
];
