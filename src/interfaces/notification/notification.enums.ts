export enum Transaction {
  FirstDonationReceived = 'FIRST_DONATION',
  /** @deprecated **/
  FirstExpected = 'FIRST_EXPECTED',
  FirstConnectionReady = 'FIRST_CONNECTION_READY',
  DonationReceived = 'DONATION_RECEIVED',
  ConnectionStopped = 'CONNECTION_STOPPED',
  ConnectionResumed = 'CONNECTION_RESUMED',
  ConnectionReady = 'CONNECTION_READY',
  ConnectionRemoved = 'CONNECTION_REMOVED',
  ReceiptDonation = 'RECEIPT_DONATION',
  /** @deprecated **/
  ReceiptExpected = 'RECEIPT_EXPECTED',
  ReceiptExemptionRequested = 'RECEIPT_EXEMPTION_REQUESTED',
  AccountRemoved = 'ACCOUNT_REMOVED',
  PendingFirstConnection = 'PENDING_FIRST_CONNECTION',
  AllowedMessageToUser = 'ALLOWED_MESSAGE_TO_USER',
  AllowedMessageToUserSameDomain = 'ALLOWED_MESSAGE_TO_USER_SAME_DOMAIN',
  AllowedMessageToUserGatedUser = 'ALLOWED_MESSAGE_TO_USER_GATED_USER',
  ExpectedConsentRequested = 'EXPECTED_CONSENT_REQUESTED',
}
