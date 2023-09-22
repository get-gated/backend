import { Options } from '@mikro-orm/core';
import ServiceProviderEntities from './src/domains/service-provider/entities';
import GatekeeperEntities from './src/domains/gatekeeper/entities';
import ChallengeEntities from './src/domains/challenge/entities';
import PaymentEntities from './src/domains/payment/entities';
import UserEntities from './src/domains/user/entities';
import NotificationEntities from './src/domains/notification/entities';

export function getOptions(): Options {
  return {
    type: 'postgresql',
    dbName: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 5432),
    entities: [
      ...ServiceProviderEntities,
      ...PaymentEntities,
      ...GatekeeperEntities,
      ...ChallengeEntities,
      ...UserEntities,
      ...NotificationEntities,
    ],
    migrations: {
      tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
      path: './schema/migrations', // path to the folder with migrations
      pattern: /^[\w-]+\d+\.ts$/, // regex pattern for the migration files
      transactional: true, // wrap each migration in a transaction
      disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
      allOrNothing: true, // wrap all migrations in master transaction
      dropTables: true, // allow to disable table dropping
      safe: false, // allow to disable table and column dropping
      emit: 'ts', // migration generation mode
    },
    pool: {
      max: Number(process.env.DB_POOL_MAX || 5),
      min: Number(process.env.DB_POOL_MIN || 2),
    },
  };
}

export default getOptions();
