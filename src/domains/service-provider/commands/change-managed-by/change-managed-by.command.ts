import { ManagedBy } from '../../service-provider.enums';

export class ChangeManagedByCommand {
  constructor(
    public readonly connectionId: string,
    public readonly manageBy: ManagedBy,
    public readonly insertLabelInstructions = false,
  ) {}
}
