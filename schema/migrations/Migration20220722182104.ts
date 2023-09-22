import { Migration } from '@mikro-orm/migrations';

export class Migration20220722182104 extends Migration {

  async up(): Promise<void> {

    this.addSql('create table "service_provider_gmail_history" ("id" uuid not null, "external_history_id" varchar(255) not null, "external_message_id" varchar(255) not null, "processed_at" timestamptz(0) not null);');
    this.addSql('alter table "service_provider_gmail_history" add constraint "service_provider_gmail_history_pkey" primary key ("id");');

    this.addSql('alter table "service_provider_thread_moves" add column "history_id" varchar(255) null;');
    this.addSql('create index "service_provider_thread_moves_history_id_index" on "service_provider_thread_moves" ("history_id");');
  }

}
