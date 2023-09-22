import { Migration } from '@mikro-orm/migrations';

export class Migration20220201002405 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "avatar" varchar(255) null;');

    this.addSql('alter table "challenge_interactions" add column "payment_amount" int4 null;');

    this.addSql('create table "service_provider_connection_monthly_stats" ("id" uuid not null, "connection_id" uuid not null, "month" int4 not null, "year" int4 not null, "received_messages" int4 not null, "gated_messages" int4 not null);');
    this.addSql('alter table "service_provider_connection_monthly_stats" add constraint "service_provider_connection_monthly_stats_pkey" primary key ("id");');
    this.addSql('alter table "service_provider_connection_monthly_stats" add constraint "service_provider_connection_monthly_stats_connection_id_foreign" foreign key ("connection_id") references "service_provider_connections" ("id") on update cascade;');
    this.addSql('create index "service_provider_connection_monthly_stats_month_year_index" on "service_provider_connection_monthly_stats" ("month", "year");');
  }

}
