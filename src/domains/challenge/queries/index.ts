import { ChallengeHasInteractionHandler } from './challenge-has-interaction/challenge-has-interaction.handler';
import { ChallengesHandler } from './challenges/challenges.handler';
import { ChallengeHandler } from './challenge/challenge.handler';
import { ChallengeGrapqhlResolver } from './challenge/challenge.grapqhl-resolver';
import { ChallengesGraphqlResolver } from './challenges/challenges.graphql-resolver';
import { ChallengeInteractionsHandler } from './challenge-interactions/challenge-interactions.handler';
import { ChallengeInteractionsGraphqlResolver } from './challenge-interactions/challenge-interactions.graphql-resolver';
import { ChallengeByMessageIdHandler } from './challenge-by-message-id/challenge-by-message-id.handler';
import {
  ChallengeForDecisionGraphqlResolver,
  ChallengeForMessageGraphqlResolver,
} from './challenge-by-message-id/challenge-by-message-id.graphql-resolver';
import { ConnectionSettingsQueryHandler } from './connection-settings/connection-settings.query-handler';
import { ConnectionSettingsGraphqlResolver } from './connection-settings/connection-settings.graphql-resolver';
import { NonprofitCategoriesQuery } from './nonprofit-categories/nonprofit-categories.query';
import { NonprofitCategoriesGraphqlResolver } from './nonprofit-categories/nonprofit-categories.graphql-resolver';
import { NonprofitsGraphqlResolver } from './nonprofits/nonprofits.graphql-resolver';
import { NonprofitsQueryHandler } from './nonprofits/nonprofits.query-handler';
import { NonprofitGraphqlResolver } from './nonprofit/nonprofit.graphql-resolver';
import { NonprofitHandler } from './nonprofit/nonprofit.handler';
import { NonprofitCategoryHandler } from './nonprofit-category/nonprofit-category.handler';
import { NonprofitCategoryGraphqlResolver } from './nonprofit-category/nonprofit-category.graphql-resolver';
import { ChallengeTemplateGraphqlResolver } from './challenge-template/challenge-template.graphql-resolver';
import { ChallengeTemplatesQueryHandler } from './challenge-templates/challenge-templates.query-handler';
import { ChallengeTemplatePreviewGraphqlResolver } from './challenge-template-preview/challenge-template-preview.graphql-resolver';
import { ChallengeTemplatePreviewQueryHandler } from './challenge-template-preview/challenge-template-preview.query-handler';
import { ChallengeTemplatePreviewHttpController } from './challenge-template-preview/challenge-template-preview.http.controller';
import { ChallengeStatsGraphqlResolver } from './challenge-stats/challenge-stats.graphql-resolver';
import { ChallengeStatsQueryHandler } from './challenge-stats/challenge-stats.query-handler';
import { UserSettingsQueryHandler } from './user-settings/user-settings.query-handler';
import { UserSettingsGraphqlResolvers } from './user-settings/user-settings.graphql-resolvers';
import { NonprofitCategoriesQueryHandler } from './nonprofit-categories/nonprofit-categories.query-handler';
import { ChallengeTemplatesGraphqlResolver } from './challenge-templates/challenge-templates.graphql-resolver';
import { ChallengeTemplateQueryHandler } from './challenge-template/challenge-template.query-handler';
import { DefaultNonprofitQueryHandler } from './default-nonprofit/default-nonprofit.query-handler';
import { SenderChallengeQueryHandler } from './sender-challenge/sender-challenge.query-handler';
import { SenderChallengeHttpController } from './sender-challenge/sender-challenge.http.controller';
import { DonationTotalFromSenderQueryHandler } from './donation-total-from-sender/donation-total-from-sender.query-handler';
import { DonationTotalFromSenderGraphqlResolver } from './donation-total-from-sender/donation-total-from-sender.graphql-resolver';
import { ChallengeInteractionGraphqlResolver } from './challenge-interaction/challenge-interaction.graphql-resolver';
import { DonationOrBypassByThreadIdQueryHandler } from './donation-or-bypass-by-thread-id/donation-or-bypass-by-thread-id.query-handler';
import { NonprofitBySlugHttpController } from './nonprofit-by-slug/nonprofit-by-slug.http-controller';
import { NonprofitBySlugQueryHandler } from './nonprofit-by-slug/nonprofit-by-slug.query-handler';
import { NonprofitsHttpController } from './nonprofits/nonprofits.http-controller';
import { ChallengeExpectedConsentHttpController } from './challenge-expected-consent/challenge-expected-consent.http-controller';
import { ChallengeExpectedConsentQueryHandler } from './challenge-expected-consent/challenge-expected-consent.query-handler';
import { ChallengeStatsHttpController } from './challenge-stats/challenge-stats.http-controller';
import { DonationRequestHttpController } from './donation-request/donation-request.http-controller';
import { DonationRequestQueryHandler } from './donation-request/donation-request.query-handler';
import { DonationRequestsQueryHandler } from './donation-requests/donation-requests.query-handler';
import { DonationRequestsGraphqlResolver } from './donation-requests/donation-requests.graphql-resolver';
import { DonationRequestGraphqlResolver } from './donation-request/donation-request.graphql-resolver';
import { UserProfileQueryHandler } from './user-profile/user-profile.query-handler';
import { UserProfileHttpController } from './user-profile/user-profile.http-controller';
import { DonationsQueryHandler } from './donations/donations.query-handler';
import { DonationsGraphqlResolver } from './donations/donations.graphql-resolver';
import { DonationQueryHandler } from './donation/donation.query-handler';
import { DonationGraphqlResolver } from './donation/donation.graphql-resolver';
import { DonationRequestStatsGraphqlResolver } from './donation-request-stats/donation-request-stats.graphql-resolver';
import { DonationRequestStatsQueryHandler } from './donation-request-stats/donation-request-stats.query-handler';

export const providers = [
  ChallengeHasInteractionHandler,
  ChallengeHandler,
  ChallengeGrapqhlResolver,
  ChallengesHandler,
  ChallengesGraphqlResolver,
  ChallengeInteractionsHandler,
  ChallengeInteractionsGraphqlResolver,
  ChallengeInteractionGraphqlResolver,
  ChallengeByMessageIdHandler,
  ChallengeForMessageGraphqlResolver,
  ChallengeForDecisionGraphqlResolver,
  ChallengeTemplateGraphqlResolver,
  ChallengeTemplateQueryHandler,
  ChallengeTemplatesQueryHandler,
  ChallengeTemplatesGraphqlResolver,
  ConnectionSettingsQueryHandler,
  ConnectionSettingsGraphqlResolver,
  NonprofitCategoriesQuery,
  NonprofitCategoriesQueryHandler,
  NonprofitCategoriesGraphqlResolver,
  NonprofitsGraphqlResolver,
  NonprofitsQueryHandler,
  NonprofitGraphqlResolver,
  NonprofitHandler,
  NonprofitCategoryHandler,
  NonprofitCategoryGraphqlResolver,
  ChallengeTemplatePreviewGraphqlResolver,
  ChallengeTemplatePreviewQueryHandler,
  ChallengeStatsGraphqlResolver,
  ChallengeStatsQueryHandler,
  UserSettingsQueryHandler,
  UserSettingsGraphqlResolvers,
  DefaultNonprofitQueryHandler,
  SenderChallengeQueryHandler,
  DonationTotalFromSenderQueryHandler,
  DonationTotalFromSenderGraphqlResolver,
  DonationOrBypassByThreadIdQueryHandler,
  NonprofitBySlugQueryHandler,
  ChallengeExpectedConsentQueryHandler,
  DonationRequestQueryHandler,
  DonationRequestsQueryHandler,
  DonationRequestsGraphqlResolver,
  DonationRequestGraphqlResolver,
  UserProfileQueryHandler,
  DonationsQueryHandler,
  DonationsGraphqlResolver,
  DonationQueryHandler,
  DonationGraphqlResolver,
  DonationRequestStatsGraphqlResolver,
  DonationRequestStatsQueryHandler,
];

export const controllers = [
  ChallengeTemplatePreviewHttpController,
  SenderChallengeHttpController,
  NonprofitBySlugHttpController,
  NonprofitsHttpController,
  ChallengeExpectedConsentHttpController,
  ChallengeStatsHttpController,
  DonationRequestHttpController,
  UserProfileHttpController,
];
