import { DecisionHandler } from './decision/decision.handler';
import { DecisionGraphqlResolver } from './decision/decision.graphql-resolver';
import { DecisionsHandler } from './decisions/decisions.handler';
import { DecisionsGraphqlResolver } from './decisions/decisions.graphql-resolver';
import { StatsQueryHandler } from './stats/stats.query-handler';
import { StatsGraphqlResolvers } from './stats/stats.graphql-resolvers';
import { EvaluateMessageQueryHandler } from './evaluate-message/evaluate-message.query-handler';
import { SearchTrainingsGraphqlResolver } from './search-trainings/search-trainings.graphql-resolver';
import { SearchTrainingsQueryHandler } from './search-trainings/search-trainings.query-handler';
import { DecisionCountQueryHandler } from './decision-count/decision-count.query-handler';
import { PatternsQueryHandler } from './patterns/patterns.query-handler';
import { PatternsGraphqlResolver } from './patterns/patterns.graphql-resolver';
import { PatternQueryHandler } from './pattern/pattern.query-handler';
import { TrainingByEmailSentReceivedStatGraphqlResolver } from './training-by-email/training-by-email.sent-received-stat.graphql-resolver';
import { TrainingByEmailQueryHandler } from './training-by-email/training-by-email.query-handler';
import { TrainingGraphqlResolver } from './training/training.graphql-resolver';
import { DecisionCountVolumeStatGraphqlResolver } from './decision-count/decision-count.volume-stat.graphql-resolver';
import { TrainingQueryHandler } from './training/training.query-handler';
import { EvaluateMessageGraphqlResolver } from './evaluate-message/evaluate-message.graphql-resolver';
import { TrainingByEmailInheritedRuleFieldGraphqlResolver } from './training-by-email/training-by-email.inherited-rule-field.graphql-resolver';
import { OptOutAddressesGraphqlResolver } from './opt-out-addresses/opt-out-addresses.graphql-resolver';
import { OptOutAddressesQueryHandler } from './opt-out-addresses/opt-out-addresses.query-handler';
import { OptOutAddressesUserGraphqlResolver } from './opt-out-addresses/opt-out-addresses.user.graphql-resolver';
import { DecisionByMessageQueryHandler } from './decision-by-message/decision-by-message.query-handler';
import { DecisionByMessageMessageEntityGraphqlFieldResolver } from './decision-by-message/decision-by-message.message-entity.graphql-field-resolver';
import { AllowListHttpController } from './allow-list/allow-list.http-controller';
import { AllowListQueryHandler } from './allow-list/allow-list.query-handler';

export default [
  DecisionHandler,
  DecisionGraphqlResolver,
  DecisionsHandler,
  DecisionsGraphqlResolver,
  StatsQueryHandler,
  StatsGraphqlResolvers,
  EvaluateMessageQueryHandler,
  EvaluateMessageGraphqlResolver,
  SearchTrainingsGraphqlResolver,
  SearchTrainingsQueryHandler,
  DecisionCountQueryHandler,
  DecisionCountVolumeStatGraphqlResolver,
  PatternQueryHandler,
  PatternsQueryHandler,
  PatternsGraphqlResolver,
  TrainingByEmailQueryHandler,
  TrainingByEmailSentReceivedStatGraphqlResolver,
  TrainingByEmailInheritedRuleFieldGraphqlResolver,
  TrainingGraphqlResolver,
  TrainingQueryHandler,
  OptOutAddressesGraphqlResolver,
  OptOutAddressesQueryHandler,
  OptOutAddressesUserGraphqlResolver,
  DecisionByMessageQueryHandler,
  DecisionByMessageMessageEntityGraphqlFieldResolver,
  DecisionByMessageQueryHandler,

  AllowListQueryHandler,
];

export const controllers = [AllowListHttpController];
