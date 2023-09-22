import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

export enum SearchTrainingsType {
  Domains,
  Addresses,
}
export class SearchTrainingsQuery {
  constructor(
    public readonly userId: string,
    public readonly query?: string,
    public readonly type?: SearchTrainingsType,
    public readonly limit: number = 50,
    public readonly offset?: number,
    public readonly forDomain?: string,
    public readonly rule?: Rule,
  ) {}
}
