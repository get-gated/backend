import { AllowThreadReason } from '@app/interfaces/gatekeeper/gatekeeper.enums';

export class AllowThreadCommand {
  constructor(
    public readonly threadId: string,
    public readonly reason: AllowThreadReason,
  ) {}
}
