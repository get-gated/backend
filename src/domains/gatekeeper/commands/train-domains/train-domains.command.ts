import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';

export class TrainDomainsCommand {
  constructor(
    public readonly userId: string,
    public readonly domains: string[],
    public readonly rule: Rule,
    public readonly origin: TrainingOrigin,
    public readonly preventOverwrite: boolean = false,
  ) {}
}
