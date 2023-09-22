import { Migration } from '@mikro-orm/migrations';

export class Migration20220201181736 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_templates" drop constraint if exists "challenge_templates_name_check";');
    this.addSql('alter table "challenge_templates" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "challenge_templates" alter column "name" drop default;');

    this.addSql('alter table "gatekeeper_patterns" drop constraint if exists "gatekeeper_patterns_updated_at_check";');
    this.addSql('alter table "gatekeeper_patterns" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "gatekeeper_patterns" alter column "updated_at" drop default;');

    this.addSql('alter table "payment" rename column "amount" to "amount_cents";');


    this.addSql('alter table "payment" drop constraint if exists "payment_provider_check";');
    this.addSql('alter table "payment" alter column "provider" type text using ("provider"::text);');
    this.addSql('alter table "payment" add constraint "payment_provider_check" check ("provider" in (\'Stripe\'));');

    this.addSql('alter table "service_provider_connections" drop constraint if exists "service_provider_connections_provider_check";');
    this.addSql('alter table "service_provider_connections" alter column "provider" type text using ("provider"::text);');
    this.addSql('alter table "service_provider_connections" add constraint "service_provider_connections_provider_check" check ("provider" in (\'GOOGLE\'));');

    this.addSql('alter table "service_provider_connection_syncs" drop constraint if exists "service_provider_connection_syncs_type_check";');
    this.addSql('alter table "service_provider_connection_syncs" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "service_provider_connection_syncs" add constraint "service_provider_connection_syncs_type_check" check ("type" in (\'SENT\'));');
  }

}
