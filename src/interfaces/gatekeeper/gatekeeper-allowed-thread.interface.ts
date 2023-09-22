import { AllowThreadReason } from './gatekeeper.enums';

export default abstract class GatekeeperAllowedThreadInterface {
  public readonly allowedThreadId: string;

  public readonly threadId: string;

  public readonly allowedAt: Date;

  public readonly reason: AllowThreadReason;

  constructor(props: GatekeeperAllowedThreadInterface) {
    this.allowedThreadId = props.allowedThreadId;
    this.threadId = props.threadId;
    this.allowedAt = props.allowedAt;
    this.reason = props.reason;
  }
}
