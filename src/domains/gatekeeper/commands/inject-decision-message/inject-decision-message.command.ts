import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';
import GatekeeperDecisionInterface from '@app/interfaces/gatekeeper/gatekeeper-decision.interface';

export class InjectDecisionMessageCommand {
  constructor(
    public readonly message: ConnectionEmailMessageInterface,
    public readonly decision: GatekeeperDecisionInterface,
  ) {}
}
