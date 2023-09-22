import { Migration } from '@mikro-orm/migrations';

export class Migration20220114200117 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "payment" drop constraint if exists "payment_provider_check";');
    this.addSql('alter table "payment" alter column "provider" type text using ("provider"::text);');
    this.addSql('alter table "payment" add constraint "payment_provider_check" check ("provider" in (\'Stripe\'));');

    this.addSql('alter table "service_provider_connections" drop constraint if exists "service_provider_connections_provider_check";');
    this.addSql('alter table "service_provider_connections" alter column "provider" type text using ("provider"::text);');
    this.addSql('alter table "service_provider_connections" add constraint "service_provider_connections_provider_check" check ("provider" in (\'GOOGLE\'));');

    this.addSql('alter table "service_provider_threads" drop constraint if exists "service_provider_threads_last_received_at_check";');
    this.addSql('alter table "service_provider_threads" alter column "last_received_at" type timestamptz(0) using ("last_received_at"::timestamptz(0));');
    this.addSql('alter table "service_provider_threads" alter column "last_received_at" drop not null;');
    this.addSql('alter table "service_provider_threads" drop constraint if exists "service_provider_threads_last_sent_at_check";');
    this.addSql('alter table "service_provider_threads" alter column "last_sent_at" type timestamptz(0) using ("last_sent_at"::timestamptz(0));');
    this.addSql('alter table "service_provider_threads" alter column "last_sent_at" drop not null;');

    this.addSql('alter table "service_provider_connection_syncs" drop constraint if exists "service_provider_connection_syncs_type_check";');
    this.addSql('alter table "service_provider_connection_syncs" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "service_provider_connection_syncs" add constraint "service_provider_connection_syncs_type_check" check ("type" in (\'SENT\'));');
  }

}
