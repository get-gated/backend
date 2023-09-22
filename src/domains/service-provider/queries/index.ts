import {
  ConnectionForChallengeGraphqlResolver,
  ConnectionForDecisionGraphqlResolver,
  ConnectionForMessageGraphqlResolver,
  ConnectionGraphqlResolver,
} from './connection/connection.graphql-resolver';
import {
  MessageForChallengeGraphqlResolver,
  MessageGraphqlResolver,
} from './message/message.graphql-resolver';
import { MessageHandler } from './message/message.handler';
import { ConnectionLogHandler } from './connection-log/connection-log.handler';
import { ConnectionLogsHandler } from './connection-logs/connection-logs.handler';
import { ConnectionLogsForConnectionGraphqlResolver } from './connection-logs/connection-logs.graphql-resolver';
import { ConnectionsHandler } from './connections/connections.handler';
import { ConnectionsGraphqlResolver } from './connections/connections.graphql-resolver';
import { PreviewAllowedGraphqlResolver } from './preview-allowed/preview-allowed.graphql-resolver';
import { PreviewAllowedQueryHandler } from './preview-allowed/preview-allowed.query-handler';
import { ConnectionSyncsQueryHandler } from './connection-syncs/connection-syncs.query-handler';
import { ConnectionSyncsGraphqlResolver } from './connection-syncs/connection-syncs.graphql-resolver';
import { ConnectionQueryHandler } from './connection/connection.handler';
import { SearchConnectionsQueryHandler } from './search-connections/search-connections.query-handler';
import { SentReceivedStatsQueryHandler } from './sent-received-stats/sent-received-stats.query-handler';
import { SentReceivedStatsGraphqlResolver } from './sent-received-stats/sent-received-stats.graphql-resolver';
import { VolumeStatsQueryHandler } from './volume-stats/volume-stats.query-handler';
import { VolumeStatsGraphqlResolver } from './volume-stats/volume-stats.graphql-resolver';
import { SentReceivedStatGraphqlResolver } from './sent-received-stat/sent-received-stat.graphql-resolver';
import { SentReceivedStatQueryHandler } from './sent-received-stat/sent-received-stat.query-handler';
import { EmailProviderIsGoogleController } from './email-provider-is-google/email-provider-is-google.controller';
import { EmailProviderIsGoogleGraphqlResolver } from './email-provider-is-google/email-provider-is-google.graphql-resolver';
import { EmailProviderIsGoogleQueryHandler } from './email-provider-is-google/email-provider-is-google.query-handler';
import { MessagesQueryHandler } from './messages/messages.query-handler';
import { MessagesGraphqlResolver } from './messages/messages.graphql-resolver';
import { ConnectionByProviderIdQueryHandler } from './connection-by-provider-user-id/connection-by-provider-id.query-handler';
import { ConnectionByEmailQueryHandler } from './connection-by-email/connection-by-email.query-handler';
import { HasSentToQueryHandler } from './has-sent-to/has-sent-to.query-handler';

export const queryProviders = [
  ConnectionGraphqlResolver,
  MessageGraphqlResolver,
  MessageHandler,
  MessageForChallengeGraphqlResolver,
  ConnectionLogHandler,
  ConnectionLogsHandler,
  ConnectionLogsForConnectionGraphqlResolver,
  ConnectionForDecisionGraphqlResolver,
  ConnectionForChallengeGraphqlResolver,
  ConnectionForMessageGraphqlResolver,
  ConnectionsHandler,
  ConnectionsGraphqlResolver,
  ConnectionQueryHandler,
  ConnectionGraphqlResolver,
  HasSentToQueryHandler,
  PreviewAllowedGraphqlResolver,
  PreviewAllowedQueryHandler,
  ConnectionSyncsQueryHandler,
  ConnectionSyncsGraphqlResolver,
  SearchConnectionsQueryHandler,
  SentReceivedStatsQueryHandler,
  SentReceivedStatsGraphqlResolver,
  SentReceivedStatQueryHandler,
  SentReceivedStatGraphqlResolver,
  VolumeStatsQueryHandler,
  VolumeStatsGraphqlResolver,
  EmailProviderIsGoogleGraphqlResolver,
  EmailProviderIsGoogleQueryHandler,
  ConnectionByProviderIdQueryHandler,
  MessagesQueryHandler,
  MessagesGraphqlResolver,
  ConnectionByEmailQueryHandler,
];

export const queryControllers = [EmailProviderIsGoogleController];
