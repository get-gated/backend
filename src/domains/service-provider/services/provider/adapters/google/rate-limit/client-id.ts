import { gmail_v1 } from 'googleapis';

interface ClientInfo {
  key: any; // WeakRef
  count: number;
}
const clientIds: { [key: string]: ClientInfo } = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clientFinalizationRegistry = new (global as any).FinalizationRegistry(
  (clientId: string) => {
    if (clientIds[clientId]) {
      const info = clientIds[clientId];
      if (info.count === 1) {
        delete clientIds[clientId];
      } else {
        info.count -= 1;
      }
    }
  },
);

/**
 * Maintains a single instance of an identifier object based on a given client id.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function checkoutId(clientId: string, client: gmail_v1.Gmail): Object {
  clientFinalizationRegistry.register(client, clientId);

  let info = clientIds[clientId];
  if (!info || !(info.key as any).deref()) {
    info = {
      // eslint-disable-next-line no-new-wrappers
      key: new (global as any).WeakRef(new String(clientId)),
      count: 0,
    };
    clientIds[clientId] = info;
  }

  info.count += 1;
  return (info.key as any).deref();
}
