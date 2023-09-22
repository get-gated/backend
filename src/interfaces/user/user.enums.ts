export enum UserTask {
  ChooseNonprofit = 'CHOOSE_NONPROFIT',
  /** @deprecated */
  TrainDomains = 'TRAIN_DOMAINS',
  /** @deprecated */
  FirstInboxTraining = 'INBOX_BASICS',

  ConnectFirstAccount = 'CONNECT_FIRST_ACCOUNT',
  ReviewAllowList = 'REVIEW_ALLOW_LIST',
  TakeTour = 'TAKE_TOUR',
}

export enum UserTaskResolution {
  Completed = 'COMPLETED',
  Dismissed = 'DISMISSED',
  /** Used to mark a task as pending resolution, but task resolution may also be null. */
  Pending = 'PENDING',
}

export enum UserBenefit {
  SelfHealth = 'SELF_HEALTH',
  SocialGood = 'SOCIAL_GOOD',
  Productivity = 'PRODUCTIVITY',
  Other = 'OTHER',
}
