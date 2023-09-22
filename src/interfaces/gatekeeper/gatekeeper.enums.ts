export enum Verdict {
  AddressAllowed = 'ADDRESS_ALLOWED',
  AddressGated = 'ADDRESS_GATED',
  AddressMuted = 'ADDRESS_MUTED',
  ParticipantOnAllowedThread = 'ADDRESS_ON_THREAD',
  DomainAllowed = 'DOMAIN_ALLOWED',
  DomainGated = 'DOMAIN_GATED',
  DomainMuted = 'DOMAIN_MUTED',
  PatternAllowed = 'PATTERN_ALLOWED',
  PatternGated = 'PATTERN_GATED',
  PatternMuted = 'PATTERN_MUTED',
  /** @deprecated
   * Use one of
   * - MailingListAddressAllowed
   * - MailingListAddressGated
   * - MailingListAddressMuted
   * - MailingListDomainAllowed
   * - MailingListDomainGated
   * - MailingListDomainMuted
   * */
  MailingListIgnore = 'MAILING_LIST_IGNORE',
  MailingListAddressAllowed = 'MAILING_LIST_ADDRESS_ALLOWED',
  MailingListAddressGated = 'MAILING_LIST_ADDRESS_GATED',
  MailingListAddressMuted = 'MAILING_LIST_ADDRESS_MUTED',
  MailingListDomainAllowed = 'MAILING_LIST_DOMAIN_ALLOWED',
  MailingListDomainGated = 'MAILING_LIST_DOMAIN_GATED',
  MailingListDomainMuted = 'MAILING_LIST_DOMAIN_MUTED',
  SenderUnknownGated = 'SENDER_UNKNOWN_GATED',
  SentAllowed = 'SENT_ALLOWED',
  CalendarEventAllowed = 'CALENDAR_EVENT_ALLOWED',
  CalenderRsvpUserOrganizerAllowed = 'CALENDAR_RSVP_USER_ORGANIZER_ALLOWED',
  UserOptOutAllowed = 'USER_OPT_OUT_ALLOWED',
}

export enum TrainingOrigin {
  AdminApp = 'ADMIN_APP',
  SentEmail = 'SENT_EMAIL',
  ReceivedEmail = 'RECEIVED_EMAIL',
  Calendar = 'CALENDAR',
  Pattern = 'PATTERN',
  UserInbox = 'USER_INBOX',
  UserApp = 'USER_APP',
  InitialDefaults = 'INITIAL_DEFAULTS',
  ExpectedInteraction = 'EXPECTED_INTERACTION',
  IncludedOnAllowed = 'INCLUDED_ON_ALLOWED',
  Migration = 'MIGRATION',
}

export enum Rule {
  Allow = 'ALLOW',
  Gate = 'GATE',
  Mute = 'MUTE',
  Ignore = 'IGNORE',
}

export enum AllowThreadReason {
  UserParticipatingOn = 'USER_PARTICIPATING',
  AllowedSenderStarted = 'ALLOWED_STARTED',
}

export enum Overrule {
  UserOnBccMute = 'USER_ON_BCC_MUTE',
  CalenderEventMute = 'CALENDER_EVENT_MUTE',
}
