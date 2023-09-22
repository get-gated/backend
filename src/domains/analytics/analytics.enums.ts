/* eslint-disable @typescript-eslint/naming-convention */
export enum AnalyticEvent {
  ChallengeSent = 'ChallengeSent',
  ChallengeWithheld = 'ChallengeWithheld',
  ChallengeDonated = 'ChallengeDonated',
  ChallengeUserReplied = 'ChallengeUserReplied',
  ChallengeLinkClicked = 'ChallengeLinkClicked',
  ChallengeExpected = 'ChallengeExpected',
  ChallengeOpened = 'ChallengeOpened',

  ConnectionActivated = 'ConnectionActivated',
  ConnectionAdded = 'ConnectionAdded',
  ConnectionInitializing = 'ConnectionInitializing',
  ConnectionRunning = 'ConnectionRunning',
  ConnectionStopped = 'ConnectionStopped',
  ConnectionInvalid = 'ConnectionInvalid',
  ConnectionSyncStarted = 'ConnectionSyncStarted',
  ConnectionSyncFinished = 'ConnectionSyncFinished',

  MessageSent = 'MessageSent',
  MessageReceived = 'MessageReceived',

  DecisionMade = 'DecisionMade',
  AddressTrained = 'AddressTrained',
  DomainTrained = 'DomainTrained',

  OptOutAddressAdded = 'OptOutAddressAdded',
  OptOutAddressRemoved = 'OptOutAddressRemoved',

  Joined = 'Joined',
  JoinAttempted = 'JoinAttempted',

  NotificationUserSettingsUpdated = 'NotificationUserSettingsUpdated',
  ChallengeUserSettingsUpdated = 'ChallengeUserSettingsUpdated',
  ChallengeConnectionSettingsUpdated = 'ChallengeConnectionSettingsUpdated',

  // Below this fold are events that follow new naming convention

  backend_user_ReceivedMessage = 'backend_user_ReceivedMessage',

  backend_gatekeeper_DecisionMade = 'backend_gatekeeper_DecisionMade',
  backend_gatekeeper_MoveToGated = 'backend_gatekeeper_MoveToGated',
  backend_gatekeeper_MoveToInbox = 'backend_gatekeeper_MoveToInbox',

  backend_gatekeeper_ChallengePresented = 'backend_gatekeeper_ChallengePresented',
  backend_sender_ChallengeResponseInitiated = 'backend_sender_ChallengeResponseInitiated',
  backend_sender_DonationCompleted = 'backend_sender_DonationCompleted',
  backend_sender_BypassCompleted = 'backend_sender_BypassCompleted',
  backend_user_SendMessage = 'backend_user_SendMessage',

  backend_gatekeeper_GatedMessage = 'backend_gatekeeper_GatedMessage',
  backend_user_ChallengeReply = 'backend_user_ChallengeReply',
  backend_user_JoinedGated = 'backend_user_JoinedGated',
  backend_user_SignupComplete = 'backend_user_SignupComplete',
  backend_user_ChangeDonationSettings = 'backend_user_ChangeDonationSettings',
  backend_user_TrainedAddress = 'backend_user_TrainedAddress',
  backend_user_TrainedDomain = 'backend_user_TrainedDomain',
  backend_user_AddAddress = 'backend_user_AddAddress',
  backend_user_RemoveAddress = 'backend_user_RemoveAddress',
  backend_user_Offboard = 'backend_user_Offboard',
}
