import { EvaluateGatedSenderHandler } from './evaluate-gated-sender/evaluate-gated-sender.handler';
import { TrackLinkClickedHttpController } from './track-link-clicked/track-link-clicked.http-controller';
import { TrackOpenedHttpController } from './track-opened/track-opened.http-controller';
import { TrackLinkClickedHandler } from './track-link-clicked/track-link-clicked.handler';
import { TrackOpenedHandler } from './track-opened/track-opened.handler';
import { UserSettingsHandler } from './user-settings/user-settings.handler';
import { UserSettingsGraphqlResolver } from './user-settings/user-settings.graphql-resolver';
import { ConnectionSettingsCommandHandler } from './connection-settings/connection-settings.command-handler';
import { ConnectionSettingsGraphqlResolver } from './connection-settings/connection-settings.graphql-resolver';
import ConnectionSettingsConnectionAddedEventHandler from './connection-settings/connection-settings.connection-added.event-handler';
import EvaluateGatedSenderGatekeeperDecisionMadeEventHandler from './evaluate-gated-sender/evaluate-gated-sender.gatekeeper-decision-made.event-handler';
import { MarkUserRepliedHandler } from './mark-user-replied/mark-user-replied.handler';
import MarkUserRepliedEmailMessageCreatedEventHandler from './mark-user-replied/mark-user-replied.email-message-created.event-handler';
import UserSettingsUserJoinedEventHandler from './user-settings/user-settings.user-joined.event-handler';
import { AddNonprofitCommandHandler } from './add-nonprofit/add-nonprofit.command-handler';
import { AddNonprofitGraphqlResolver } from './add-nonprofit/add-nonprofit.graphql-resolver';
import { UpdateNonprofitCommandHandler } from './update-nonprofit/update-nonprofit.command-handler';
import { UpdateNonprofitGraphqlResolver } from './update-nonprofit/update-nonprofit.graphql-resolver';
import { SetDefaultNonprofitCommandHandler } from './set-default-nonprofit/set-default-nonprofit.command-handler';
import { SetDefaultNonprofitGraphqlResolver } from './set-default-nonprofit/set-default-nonprofit.graphql-resolver';
import { RemoveNonprofitCommandHandler } from './remove-nonprofit/remove-nonprofit.command-handler';
import { RemoveNonprofitGraphqlResolver } from './remove-nonprofit/remove-nonprofit.graphql-resolver';
import { AddNonprofitCategoryGraphqlResolver } from './add-nonprofit-category/add-nonprofit-category.graphql-resolver';
import { AddNonprofitCategoryCommandHandler } from './add-nonprofit-category/add-nonprofit-category.command-handler';
import { UpdateNonprofitCategoryCommandHandler } from './update-nonprofit-category/update-nonprofit-category.command-handler';
import { UpdateNonprofitCategoryGraphqlResolver } from './update-nonprofit-category/update-nonprofit-category.graphql-resolver';
import { RemoveNonprofitCategoryCommandHandler } from './remove-nonprofit-category/remove-nonprofit-category.command-handler';
import { RemoveNonprofitCategoryGraphqlResolver } from './remove-nonprofit-category/remove-nonprofit-category.graphql-resolver';
import { AddChallengeTemplateGraphqlResolver } from './add-challenge-template/add-challenge-template.graphql-resolver';
import { AddChallengeTemplateCommandHandler } from './add-challenge-template/add-challenge-template.command-handler';
import { UpdateChallengeTemplateGraphqlResolver } from './update-challenge-template/update-challenge-template.graphql-resolver';
import { UpdateChallengeTemplateCommandHandler } from './update-challenge-template/update-challenge-template.command-handler';
import { ToggleChallengeTemplateCommandHandler } from './toggle-challenge-template/toggle-challenge-template.command-handler';
import { ToggleChallengeTemplateGraphqlResolver } from './toggle-challenge-template/toggle-challenge-template.graphql-resolver';
import { MarkExpectedCommandHandler } from './mark-expected/mark-expected.command-handler';
import { MarkExpectedGraphqlResolver } from './mark-expected/mark-expected.graphql-resolver';
import { InjectChallengeResponseChallengeInteractionEventHandler } from './inject-challenge-response/inject-challenge-response.challenge-interaction.event-handler';
import { InjectChallengeResponseCommandHandler } from './inject-challenge-response/inject-challenge-response.command-handler';
import { UpdateNonprofitSetSlugJob } from './update-nonprofit/update-nonprofit.set-slug.job';
import { MarkExpectedConsentCommandHandler } from './mark-expected-consent/mark-expected-consent.command-handler';
import { MarkExpectedConsentHttpController } from './mark-expected-consent/mark-expected-consent.http-controller';
import { SenderDonateCommandHandler } from './sender-donate/sender-donate.command-handler';
import { SenderDonateGraphqlResolver } from './sender-donate/sender-donate.graphql-resolver';
import { TrackImpressionHttpController } from './track-impression/track-impression.http-controller';
import { TrackImpressionHandler } from './track-impression/track-impression.handler';
import { TrackImpressionChallengeInteractionEventHandler } from './track-impression/track-impression.challenge-interaction.event-handler';
import { DonateCommandHandler } from './donate/donate.command-handler';
import { RequestDonationCommandHandler } from './request-donation/request-donation.command-handler';
import { RequestDonationGraphqlResolver } from './request-donation/request-donation.graphql-resolver';
import { DonateGraphqlResolver } from './donate/donate.graphql-resolver';

export const providers = [
  EvaluateGatedSenderHandler,
  EvaluateGatedSenderGatekeeperDecisionMadeEventHandler,
  MarkUserRepliedHandler,
  MarkUserRepliedEmailMessageCreatedEventHandler,
  TrackLinkClickedHandler,
  TrackOpenedHandler,
  UserSettingsHandler,
  UserSettingsGraphqlResolver,
  UserSettingsUserJoinedEventHandler,
  ConnectionSettingsCommandHandler,
  ConnectionSettingsGraphqlResolver,
  ConnectionSettingsConnectionAddedEventHandler,
  AddNonprofitCommandHandler,
  AddNonprofitGraphqlResolver,
  UpdateNonprofitCommandHandler,
  UpdateNonprofitGraphqlResolver,
  SetDefaultNonprofitCommandHandler,
  SetDefaultNonprofitGraphqlResolver,
  RemoveNonprofitCommandHandler,
  RemoveNonprofitGraphqlResolver,
  AddNonprofitCategoryGraphqlResolver,
  AddNonprofitCategoryCommandHandler,
  UpdateNonprofitCategoryCommandHandler,
  UpdateNonprofitCategoryGraphqlResolver,
  RemoveNonprofitCategoryCommandHandler,
  RemoveNonprofitCategoryGraphqlResolver,
  AddChallengeTemplateGraphqlResolver,
  AddChallengeTemplateCommandHandler,
  UpdateChallengeTemplateGraphqlResolver,
  UpdateChallengeTemplateCommandHandler,
  ToggleChallengeTemplateCommandHandler,
  ToggleChallengeTemplateGraphqlResolver,
  MarkExpectedCommandHandler,
  MarkExpectedGraphqlResolver,
  InjectChallengeResponseCommandHandler,
  InjectChallengeResponseChallengeInteractionEventHandler,
  UpdateNonprofitSetSlugJob,
  MarkExpectedConsentCommandHandler,
  SenderDonateCommandHandler,
  SenderDonateGraphqlResolver,
  TrackImpressionHandler,
  TrackImpressionChallengeInteractionEventHandler,
  DonateCommandHandler,
  DonateGraphqlResolver,
  RequestDonationCommandHandler,
  RequestDonationGraphqlResolver,
];

export const controllers = [
  TrackLinkClickedHttpController,
  TrackOpenedHttpController,
  MarkExpectedConsentHttpController,
  TrackImpressionHttpController,
];
