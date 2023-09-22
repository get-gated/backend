import { ChargeHandler } from './charge/charge.handler';
import { ChargeGraphqlResolver } from './charge/charge.graphql-resolver';

export const providers = [ChargeHandler, ChargeGraphqlResolver];
