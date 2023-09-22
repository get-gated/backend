import ConnectionEntity from './connection.entity';
import ConnectionLogEntity from './connection-log.entity';
import HistoryThreadEntity from './history-thread.entity';
import HistoryMessageEntity from './history-message.entity';
import MoveThreadLogEntity from './move-thread-log.entity';
import SyncEntity from './sync.entity';
import { SentReceivedEntity } from './sent-received.entity';
import ScheduledConnectionRemovalEntity from './scheduled-connection-removal.entity';
import GmailHistoryEntity from './gmail-history.entity';

export default [
  ConnectionEntity,
  ConnectionLogEntity,
  HistoryMessageEntity,
  HistoryThreadEntity,
  MoveThreadLogEntity,
  SyncEntity,
  SentReceivedEntity,
  ScheduledConnectionRemovalEntity,
  GmailHistoryEntity,
];
