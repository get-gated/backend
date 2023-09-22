import { IdentifyCommandHandler } from './identify/identify.command-handler';
import { TrackCommandHandler } from './track/track.command-handler';
import { IdentifyUserJoinedEventHandler } from './identify/identify.user-joined.event-handler';
import { IdentifyChallengeUserSettingsUpdatedEventHandler } from './identify/identify.challenge-user-settings-updated.event-handler';
import { IdentifyNotificationUserSettingsUpdatedEventHandler } from './identify/identify.notification-user-settings-updated.event-handler';
import { TrackChallengeActionEventHandler } from './track/track.challenge-action.event-handler';
import { TrackChallengeInteractionEventHandler } from './track/track.challenge-interaction.event-handler';
import { TrackConnectionAddedEventHandler } from './track/track.connection-added.event-handler';
import { TrackConnectionActivatedEventHandler } from './track/track.connection-activated.event-handler';
import { TrackConnectionChangedEventHandler } from './track/track.connection-changed.event-handler';
import { TrackConnectionSyncEventHandler } from './track/track.connection-sync.event-handler';
import { TrackGatekeeperTrainingAddedEventHandler } from './track/track.gatekeeper-training-added.event-handler';
import { TrackUserJoinedEventHandler } from './track/track.user-joined.event-handler';
import { TrackNotificationUserSettingsUpdatedEventHandler } from './track/track.notification-user-settings-updated.event-handler';
import { TrackChallengeUserSettingsUpdatedEventHandler } from './track/track.challenge-user-settings-updated.event-handler';
import { TrackChallengeConnectionSettingsUpdatedEventHandler } from './track/track.challenge-connection-settings-updated.event-handler';
import { IdentifyUserUpdatedEventHandler } from './identify/identify.user-updated.event-handler';
import { TrackConnectionEmailThreadMovedBySystemEventHandler } from './track/track.email-thread-moved-by-system.event-handler';
import { TrackUserSignupCompletedEventHandler } from './track/track.user-signup-completed.event-handler';
import { TrackGatekeeperOptOutAddressRemovedEventHandler } from './track/track.gatekeeper-opt-out-address-removed.event-handler';
import { TrackGatekeeperOptOutAddressAddedEventHandler } from './track/track.gatekeeper-opt-out-address-added.event-handler';
import TrackEmailProviderCheckedEventHandler from './track/track.email-provider-checked.event-handler';
import { TrackUserRemovedEventHandler } from './track/track.user-removed.event-handler';
import { TrackConnectionRemovedEventHandler } from './track/track.connection-removed.event-handler';

export const providers = [
  IdentifyCommandHandler,
  IdentifyUserJoinedEventHandler,
  IdentifyChallengeUserSettingsUpdatedEventHandler,
  IdentifyNotificationUserSettingsUpdatedEventHandler,
  IdentifyUserUpdatedEventHandler,

  TrackCommandHandler,
  TrackChallengeActionEventHandler,
  TrackChallengeInteractionEventHandler,
  TrackConnectionAddedEventHandler,
  TrackConnectionActivatedEventHandler,
  TrackConnectionChangedEventHandler,
  TrackConnectionSyncEventHandler,
  TrackGatekeeperTrainingAddedEventHandler,
  TrackUserJoinedEventHandler,
  TrackNotificationUserSettingsUpdatedEventHandler,
  TrackChallengeUserSettingsUpdatedEventHandler,
  TrackChallengeConnectionSettingsUpdatedEventHandler,
  TrackConnectionEmailThreadMovedBySystemEventHandler,
  TrackUserSignupCompletedEventHandler,
  TrackEmailProviderCheckedEventHandler,
  TrackGatekeeperOptOutAddressAddedEventHandler,
  TrackGatekeeperOptOutAddressRemovedEventHandler,
  TrackUserRemovedEventHandler,
  TrackConnectionRemovedEventHandler,
];
