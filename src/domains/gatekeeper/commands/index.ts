import { EvaluateMessageHandler } from './evaluate-message/evaluate-message.handler';
import { TrainAddressesHandler } from './train-addresses/train-addresses.handler';
import EvaluateMessageEmailMessageCreatedEventHandler from './evaluate-message/evaluate-message.email-message-created.event-handler';
import TrainAddressesEmailMessageCreatedEventHandler from './train-addresses/train-addresses.email-message-created.event-handler';
import TrainAddressesCalenderEventReceivedEventHandler from './train-addresses/train-addresses.calender-event-received.event-handler';
import TrainAddressesEmailMessageSyncedEventHandler from './train-addresses/train-addresses.email-message-synced.event-handler';
import { TrainAddressesGraphqlResolver } from './train-addresses/train-addresses.graphql-resolver';
import { TrainDomainsCommandHandler } from './train-domains/train-domains.command-handler';
import { TrainDomainsConnectionAddedEventHandler } from './train-domains/train-domains.connection-added.event-handler';
import { TrainDomainsGraphqlResolver } from './train-domains/train-domains.graphql-resolver';
import { AllowThreadCommandHandler } from './allow-thread/allow-thread.command-handler';
import AllowThreadDecisionMadeEventHandler from './allow-thread/allow-thread.decision-made.event-handler';
import AllowThreadEmailMessageCreatedEventHandler from './allow-thread/allow-thread.email-message-created.event-handler';
import TrainAddressesEmailMessageLabelsAddedEventHandler from './train-addresses/train-addresses.email-message-labels-added.event-handler';
import { AddPatternGraphqlResolver } from './add-pattern/add-pattern.graphql-resolver';
import { AddPatternCommandHandler } from './add-pattern/add-pattern.command-handler';
import { UpdatePatternCommandHandler } from './update-pattern/update-pattern.command-handler';
import { UpdatePatternGraphqlResolver } from './update-pattern/update-pattern.graphql-resolver';
import { RemovePatternCommandHandler } from './remove-pattern/remove-pattern.command-handler';
import { RemovePatternGraphqlResolver } from './remove-pattern/remove-pattern.graphql-resolver';
import TrainAddressesChallengeInteractionEventHandler from './train-addresses/train-addresses.challenge-interaction.event-handler';
import TrainAddressesGatekeeperDecisionMadeEventHandler from './train-addresses/train-addresses.gatekeeper-decision-made.event-handler';
import { AddOptOutAddressGraphqlResolver } from './add-opt-out-address/add-opt-out-address.graphql-resolver';
import { RemoveOptOutAddressGraphqlResolver } from './remove-opt-out-address/remove-opt-out-address.graphql-resolver';
import { RemoveOptOutAddressCommandHandler } from './remove-opt-out-address/remove-opt-out-address.command-handler';
import { AddOptOutAddressCommandHandler } from './add-opt-out-address/add-opt-out-address.command-handler';
import { InjectDecisionMessageGatekeeperDecisionMadeEventHandler } from './inject-decision-message/inject-decision-message.gatekeeper-decision-made.event-handler';
import { InjectDecisionMessageCommandHandler } from './inject-decision-message/inject-decision-message.command-handler';

export const providers = [
  EvaluateMessageHandler,
  EvaluateMessageEmailMessageCreatedEventHandler,
  TrainAddressesHandler,
  TrainAddressesEmailMessageCreatedEventHandler,
  TrainAddressesCalenderEventReceivedEventHandler,
  TrainAddressesEmailMessageSyncedEventHandler,
  TrainAddressesEmailMessageLabelsAddedEventHandler,
  TrainAddressesChallengeInteractionEventHandler,
  TrainAddressesGatekeeperDecisionMadeEventHandler,
  TrainAddressesGraphqlResolver,
  TrainDomainsCommandHandler,
  TrainDomainsConnectionAddedEventHandler,
  TrainDomainsGraphqlResolver,
  AllowThreadCommandHandler,
  AllowThreadDecisionMadeEventHandler,
  AllowThreadEmailMessageCreatedEventHandler,
  AddPatternGraphqlResolver,
  AddPatternCommandHandler,
  UpdatePatternCommandHandler,
  UpdatePatternGraphqlResolver,
  RemovePatternCommandHandler,
  RemovePatternGraphqlResolver,
  AddOptOutAddressCommandHandler,
  AddOptOutAddressGraphqlResolver,
  RemoveOptOutAddressCommandHandler,
  RemoveOptOutAddressGraphqlResolver,
  InjectDecisionMessageCommandHandler,
  InjectDecisionMessageGatekeeperDecisionMadeEventHandler,
];
