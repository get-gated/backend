import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';

export class TrainAddressesCommand {
  constructor(
    public readonly userId: string,
    public readonly addresses: string[],
    public readonly rule: Rule,
    public readonly origin: TrainingOrigin,
    public readonly preventOverwrite: boolean = false,
  ) {}
}
