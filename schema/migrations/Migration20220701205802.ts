import { Migration } from '@mikro-orm/migrations';

export class Migration20220701205802 extends Migration {

  async up(): Promise<void> {

    this.addSql('create table "service_provider_scheduled_connection_removals" ("id" uuid not null, "connection_id" varchar(255) not null, "created_at" timestamptz(0) not null, "completed_at" timestamptz(0) null);');
    this.addSql('alter table "service_provider_scheduled_connection_removals" add constraint "service_provider_scheduled_connection_removals_pkey" primary key ("id");');
    this.addSql('create index "service_provider_scheduled_connection_removals_connection_id_index" on "service_provider_scheduled_connection_removals" ("connection_id");');
    this.addSql('create index "service_provider_scheduled_connection_removals_created_at_index" on "service_provider_scheduled_connection_removals" ("created_at");');
    this.addSql('create index "service_provider_scheduled_connection_removals_completed_at_index" on "service_provider_scheduled_connection_removals" ("completed_at");');

    this.addSql('alter table "service_provider_sent_received" add column "connection_id" varchar(255) null;');
    this.addSql('create index "service_provider_sent_received_connection_id_index" on "service_provider_sent_received" ("connection_id");');

    this.addSql('alter table "service_provider_threads" add column "is_anonymized" bool not null default false;');

    this.addSql('alter table "service_provider_messages" add column "is_anonymized" bool not null default false;');

  }

}
