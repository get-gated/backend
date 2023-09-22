import { NetworkConnectionsFilter } from './network-connections.request.dto';

export class NetworkConnectionsQuery {
  constructor(
    public readonly userId: string,
    public readonly limit: number = 50,
    public readonly offset: number = 0,
    public readonly filter?: NetworkConnectionsFilter,
  ) {}
}
