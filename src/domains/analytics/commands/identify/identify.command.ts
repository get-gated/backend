import {
  TContext,
  TIdentifyTraits,
} from '../../services/adapters/adapter.interface';

export class IdentifyCommand {
  constructor(
    public readonly userId: string,
    public readonly traits: TIdentifyTraits,
    public readonly context?: TContext,
  ) {}
}
