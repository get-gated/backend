import { Migration } from '@mikro-orm/migrations';

export class Migration20220303020704 extends Migration {

  async up(): Promise<void> {

    this.addSql('alter table "service_provider_connection_syncs" drop constraint if exists "service_provider_connection_syncs_type_check";');
    this.addSql('alter table "service_provider_connection_syncs" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "service_provider_connection_syncs" add constraint "service_provider_connection_syncs_type_check" check ("type" in (\'SENT\', \'RECEIVED\'));');


    this.addSql('create table "service_provider_send_receive_domain_stats" ("id" uuid not null, "user_id" uuid not null, "domain" varchar(255) not null, "received_count" int4 not null, "sent_count" int4 not null, "first_seen_at" timestamptz(0) not null, "last_seen_at" timestamptz(0) not null);');
    this.addSql('alter table "service_provider_send_receive_domain_stats" add constraint "service_provider_send_receive_domain_stats_pkey" primary key ("id");');
    this.addSql('alter table "service_provider_send_receive_domain_stats" add constraint "service_provider_send_receive_domain_stats_domain_user_id_unique" unique ("domain", "user_id");');

    this.addSql('create table "service_provider_send_receive_address_stats" ("id" uuid not null, "user_id" uuid not null, "username" varchar(255) not null, "domain" varchar(255) not null, "display" varchar(255) not null, "received_count" int4 not null, "sent_count" int4 not null, "first_seen_at" timestamptz(0) not null, "last_seen_at" timestamptz(0) not null);');
    this.addSql('alter table "service_provider_send_receive_address_stats" add constraint "service_provider_send_receive_address_stats_pkey" primary key ("id");');
    this.addSql('alter table "service_provider_send_receive_address_stats" add constraint "service_provider_send_receive_address_stats_username_domain_user_id_unique" unique ("username", "domain", "user_id");');
  }

}
