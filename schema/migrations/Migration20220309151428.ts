import { Migration } from '@mikro-orm/migrations';

export class Migration20220309151428 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "service_provider_sent_received" ("id" varchar(255) not null, "user_id" varchar(255) not null, "external_message_id" varchar(255) not null, "username" varchar(255) not null, "domain" varchar(255) not null, "type" text check ("type" in (\'sent\', \'received\')) not null, "participant_field" text check ("participant_field" in (\'to\', \'cc\', \'bcc\', \'from\', \'unknown\')) not null, "participant" jsonb not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "service_provider_sent_received" add constraint "service_provider_sent_received_pkey" primary key ("id");');
    this.addSql('create index "service_provider_sent_received_user_id_index" on "service_provider_sent_received" ("user_id");');

    this.addSql('alter table "service_provider_connection_syncs" add column "is_syncing" bool not null default false;');
    this.addSql('alter table "service_provider_connection_syncs" drop constraint if exists "service_provider_connection_syncs_started_at_check";');
    this.addSql('alter table "service_provider_connection_syncs" alter column "started_at" type timestamptz(0) using ("started_at"::timestamptz(0));');
    this.addSql('alter table "service_provider_connection_syncs" alter column "started_at" drop not null;');

    this.addSql('alter table "service_provider_sent_received" add constraint "service_provider_sent_received_user_id_external_message_id_username_domain_unique" unique ("user_id", "external_message_id", "username", "domain");');

    this.addSql('drop table if exists "service_provider_send_receive_address_stats" cascade;');
    this.addSql('drop table if exists "service_provider_send_receive_domain_stats" cascade;');

    this.addSql('drop index "service_provider_messages_external_message_id_index";');
    this.addSql('alter table "service_provider_messages" add constraint "service_provider_messages_external_message_id_unique" unique ("external_message_id");');

    this.addSql('alter table "service_provider_messages" drop constraint if exists "service_provider_messages_thread_id_check";');
    this.addSql('alter table "service_provider_messages" alter column "thread_id" type uuid using ("thread_id"::uuid);');
    this.addSql('alter table "service_provider_messages" alter column "thread_id" drop not null;');
  }

}
