export enum ChallengeInteraction {
  Clicked = 'CLICKED',
  Opened = 'OPENED',
  Donated = 'DONATED',
  Expected = 'EXPECTED',
  UserReplied = 'USER_REPLIED',
  UserExpectedConsentGranted = 'USER_EXPECTED_CONSENT_GRANTED',
  UserExpectedConsentDenied = 'USER_EXPECTED_CONSENT_DENIED',
}

export type ChallengeInteractionUserRepliedTo =
  | ChallengeInteraction.Donated
  | ChallengeInteraction.Expected;

export enum ChallengeAction {
  Present = 'PRESENT',
  Withhold = 'WITHHOLD',
}

export enum ChallengeWithholdReason {
  RecentChallenge = 'RECENT_CHALLENGE',
  UserDisableSetting = 'USER_DISABLE_SETTING',
  CalendarEvent = 'CALENDAR_EVENT',
}

export enum ChallengeMode {
  Send = 'SEND',
  Draft = 'DRAFT',
  Disable = 'DISABLE',
}

export enum ExpectedReason {
  KnowPersonally = 'KNOW_PERSONALLY',
  RequestedMessage = 'REQUESTED_MESSAGE',
  NonEmailFollowUp = 'NON_EMAIL_FOLLOW_UP',
  Other = 'OTHER',
}

export enum ExpectedConsent {
  Granted = 'GRANTED',
  Denied = 'DENIED',
}

export enum ImpressionSource {
  ChallengeEmail = 'CHALLENGE_EMAIL',
  UserPage = 'USER_PAGE',
  UserSignature = 'USER_SIGNATURE',
}

export enum DonationRequestType {
  SingleUse = 'SINGLE_USE',
  LongLiving = 'LONG_LIVING',
}

export enum DonationRequestInteraction {
  Visited = 'VISITED',
  Donated = 'DONATED',
  ExemptionRequested = 'EXEMPTION_REQUESTED',
  ExemptionGranted = 'EXEMPTION_GRANTED',
  ExemptionDenied = 'EXEMPTION_DENIED',
}
