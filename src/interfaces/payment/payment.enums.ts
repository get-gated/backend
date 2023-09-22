export enum Type {
  BANK_ACCOUNT = 'BankAccount',
  CARD = 'Card',
}

export enum Provider {
  STRIPE = 'Stripe',
}

export enum PaymentInitiator {
  CHALLENGE_INTERACTION = 'ChallengeInteraction',
  VISITOR_INTERACTION = 'VisitorInteraction',
  USER_DONATION_REQUEST = 'UserDonationRequest',
}
