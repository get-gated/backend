import { Overrule, Rule, Verdict } from './gatekeeper.enums';

export default abstract class GatekeeperDecisionInterface {
  public readonly decisionId: string;

  public readonly userId: string;

  public readonly connectionId: string;

  public readonly emailAddress: string;

  public readonly messageId: string;

  public readonly threadId: string;

  public readonly enforcedTrainingId?: string;

  public readonly enforcedPatternId?: string;

  public readonly enforcedOptOutAddressId?: string;

  public readonly verdict: Verdict;

  public readonly ruling: Rule;

  public readonly decidedAt: Date;

  public readonly overrulingMade?: Overrule;

  constructor(props: GatekeeperDecisionInterface) {
    this.decisionId = props.decisionId;
    this.userId = props.userId;
    this.connectionId = props.connectionId;
    this.emailAddress = props.emailAddress;
    this.messageId = props.messageId;
    this.threadId = props.threadId;
    this.enforcedPatternId = props.enforcedPatternId;
    this.enforcedTrainingId = props.enforcedTrainingId;
    this.enforcedOptOutAddressId = props.enforcedOptOutAddressId;
    this.verdict = props.verdict;
    this.ruling = props.ruling;
    this.decidedAt = new Date(props.decidedAt);
    this.overrulingMade = props.overrulingMade;
  }
}
