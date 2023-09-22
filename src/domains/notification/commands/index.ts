import { SendTxEmailHandler } from './send-tx-email/send-tx-email.handler';
import SendTxEmailChallengeInteractionEventHandler from './send-tx-email/send-tx-email.challenge-interaction.event-handler';
import SendTxEmailConnectionChangedEventHandler from './send-tx-email/send-tx-email.connection-changed.event-handler';
import SendTxEmailConnectionRemovedEventHandler from './send-tx-email/send-tx-email.connection-removed.event-handler';
import SendTxEmailUserRemovedEventHandler from './send-tx-email/send-tx-email.user-removed.event-handler';
import UserTaskPendingEventHandler from './send-tx-email/send-tx-email.user-task-pending.event-handler';
import { UpdateUserSettingsUserJoinedEventHandler } from './update-user-settings/update-user-settings.user-joined.event-handler';
import { UpdateUserSettingsCommandHandler } from './update-user-settings/update-user-settings.command-handler';
import { UpdateUserSettingsGraphqlResolver } from './update-user-settings/update-user-settings.graphql-resolver';
import { AlertCommandHandler } from './alert/alert.command-handler';
import AlertUserJoinedEventHandler from './alert/alert.user-joined.event-handler';
import AlertChallengeInteractionEventHandler from './alert/alert.challenge-interaction.event-handler';
import AlertEmailProviderCheckedEventHandler from './alert/alert.email-provider-checked.event-handler';
import AlertUserRemovedEventHandler from './alert/alert.user-removed.event-handler';
import DeleteUserSettingsUserRemovedEventHandler from './delete-user-settings/delete-user-settings.user-removed.event-handler';
import { DeleteUserSettingsCommandHandler } from './delete-user-settings/delete-user-settings.handler';
import { MoveTxEmailToInboxCommandHandler } from './move-tx-emails-to-inbox/move-tx-email-to-inbox.command-handler';
import MoveTxEmailToInboxMessageCreatedEventHandler from './move-tx-emails-to-inbox/move-tx-email-to-inbox.message-created.event-handler';
import { AddPushTokenCommandHandler } from './add-push-token/add-push-token.command-handler';
import { AddPushTokenGraphqlResolver } from './add-push-token/add-push-token.graphql-resolver';
import { ProcessPushReceiptsCommandHandler } from './process-push-receipts/process-push-receipts.command-handler';
import { ProcessPushReceiptsJob } from './process-push-receipts/process-push-receipts.job';
import { SendPushCommandHandler } from './send-push/send-push.command-handler';
import { AcknowledgeGraphqlResolver } from './acknowledge/acknowledge.graphql-resolver';
import { AcknowledgeCommandHandler } from './acknowledge/acknowledge.command-handler';
import { SendPushDonationReceivedEventHandler } from './send-push/send-push.donation-received.event-handler';
import { AlertDonationReceivedEventHandler } from './alert/alert.donation-received.event-handler';

export const providers = [
  SendTxEmailHandler,
  SendTxEmailChallengeInteractionEventHandler,
  SendTxEmailConnectionChangedEventHandler,
  SendTxEmailConnectionRemovedEventHandler,
  SendTxEmailUserRemovedEventHandler,
  UpdateUserSettingsUserJoinedEventHandler,
  UpdateUserSettingsCommandHandler,
  UpdateUserSettingsGraphqlResolver,
  AlertCommandHandler,
  AlertUserJoinedEventHandler,
  AlertChallengeInteractionEventHandler,
  AlertEmailProviderCheckedEventHandler,
  AlertUserRemovedEventHandler,
  UserTaskPendingEventHandler,
  DeleteUserSettingsUserRemovedEventHandler,
  DeleteUserSettingsCommandHandler,
  MoveTxEmailToInboxCommandHandler,
  MoveTxEmailToInboxMessageCreatedEventHandler,
  AddPushTokenCommandHandler,
  AddPushTokenGraphqlResolver,
  SendPushCommandHandler,
  ProcessPushReceiptsCommandHandler,
  ProcessPushReceiptsJob,
  AcknowledgeGraphqlResolver,
  AcknowledgeCommandHandler,
  SendPushDonationReceivedEventHandler,
  AlertDonationReceivedEventHandler,
];
