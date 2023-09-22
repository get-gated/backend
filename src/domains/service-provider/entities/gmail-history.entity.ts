import {
  Entity,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

type IGmailHistoryConstructor = Omit<
  // eslint-disable-next-line no-use-before-define
  GmailHistoryEntity,
  'gmailHistoryId' | 'processedAt' | typeof PrimaryKeyType
>;

@Entity({ tableName: 'service_provider_gmail_history' })
@Index({ properties: ['externalHistoryId', 'externalMessageId'] })
export default class GmailHistoryEntity {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  gmailHistoryId: string;

  [PrimaryKeyType]!: string;

  @Property()
  externalHistoryId: string;

  @Property()
  externalMessageId: string;

  @Property()
  processedAt: Date;

  constructor(props: IGmailHistoryConstructor) {
    this.processedAt = new Date();
    this.gmailHistoryId = uuidv4();
    this.externalHistoryId = props.externalHistoryId;
    this.externalMessageId = props.externalMessageId;
  }
}
