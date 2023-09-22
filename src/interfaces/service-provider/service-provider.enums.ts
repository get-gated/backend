export enum Provider {
  Google = 'GOOGLE',
  // Uncomment as supported
  // Exchange = 'EXCHANGE',
  // Office365 = 'OFFICE_365',
  // Outlook = 'OUTLOOK',
  // Yahoo = 'YAHOO',
}

export enum Status {
  Running = 'RUNNING',
  Invalid = 'INVALID',
  Initializing = 'INITIALIZING',
  Provisioned = 'PROVISIONED',
}

export enum ParticipantField {
  To = 'to',
  Cc = 'cc',
  Bcc = 'bcc',
  From = 'from',
  Unknown = 'unknown',
}

export enum MessageType {
  Sent = 'sent',
  Received = 'received',
}

export enum Label {
  Inbox = 'inbox',
  All = 'all',
  Trash = 'trash',
  Archive = 'archive',
  Drafts = 'drafts',
  Sent = 'sent',
  Spam = 'spam',
  Important = 'important',
  Gated = 'Gated',
  Expected = 'Expected',
  Donation = 'Donation',
  TrainAsGated = 'TrainAsGated',
  TrainAsAllowed = 'TrainAsAllowed',
}

export enum SyncType {
  Sent = 'SENT',
  Received = 'RECEIVED',
}

export type MoveThreadDestination =
  | Label.Gated
  | Label.Donation
  | Label.Expected
  | Label.Inbox;

export enum ConnectionRemovedTrigger {
  User = 'user',
  AccountRemoval = 'account_removal',
}
