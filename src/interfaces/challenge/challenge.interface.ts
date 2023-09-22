import ChallengeNonprofitInterface from '@app/interfaces/challenge/challenge-nonprofit.interface';

import {
  ChallengeAction,
  ChallengeMode,
  ChallengeWithholdReason,
} from './challenge.enums';

export default abstract class ChallengeInterface {
  public readonly challengeId: string;

  public readonly userId: string;

  public readonly connectionId: string;

  public readonly threadId: string;

  public readonly messageId: string;

  public readonly action: ChallengeAction;

  public readonly withholdReason?: ChallengeWithholdReason;

  public readonly mode: ChallengeMode;

  public readonly to: string;

  public readonly body: string;

  public readonly createdAt?: Date;

  public readonly sentMessageId?: string;

  abstract nonprofit: ChallengeNonprofitInterface;

  public readonly injectResponses: boolean;

  constructor(props: ChallengeInterface) {
    this.challengeId = props.challengeId;
    this.userId = props.userId;
    this.connectionId = props.connectionId;
    this.threadId = props.threadId;
    this.messageId = props.messageId;
    this.action = props.action;
    this.withholdReason = props.withholdReason;
    this.to = props.to;
    this.body = props.body;
    this.createdAt = props.createdAt ? new Date(props.createdAt) : new Date();
    this.mode = props.mode;
    this.sentMessageId = props.sentMessageId;
    this.injectResponses = props.injectResponses;
  }
}
