export enum Metric {
  SignupSuccess = 'signup_success',
  SignupError = 'signup_error',
  DecisionMade = 'decision_made',
  ChallengeSent = 'challenge_sent',
}

export enum SpanEvent {
  MessageReceived = 'message_received',
  MessageDecided = 'message_decided',
  MessageMoved = 'message_moved',
  MessageChallenged = 'message_challenged',
}

export enum Span {
  ConnectionSync = 'connection_sync',
}
