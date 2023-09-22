import { AsyncLocalStorage } from 'async_hooks';

import { EntityManager } from '@mikro-orm/postgresql';

export const MikroOrmStorage = new AsyncLocalStorage<EntityManager>();
