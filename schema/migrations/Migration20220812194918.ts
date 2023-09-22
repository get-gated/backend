import { Migration } from '@mikro-orm/migrations';

export class Migration20220812194918 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "gatekeeper_injected_decision_messages" ("id" uuid not null, "user_id" uuid not null, "connection_id" uuid not null, "thread_id" uuid not null, "message_id" uuid not null, "decision_id" uuid not null, "body" text not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "gatekeeper_injected_decision_messages" add constraint "gatekeeper_injected_decision_messages_pkey" primary key ("id");');
    this.addSql('create index "gatekeeper_injected_decision_messages_user_id_index" on "gatekeeper_injected_decision_messages" ("user_id");');
    this.addSql('create index "gatekeeper_injected_decision_messages_thread_id_index" on "gatekeeper_injected_decision_messages" ("thread_id");');

    this.addSql('create table "gatekeeper_user_settings" ("id" uuid not null, "user_id" uuid not null, "is_inject_decisions_enabled" bool not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "gatekeeper_user_settings" add constraint "gatekeeper_user_settings_pkey" primary key ("id");');
    this.addSql('create index "gatekeeper_user_settings_user_id_index" on "gatekeeper_user_settings" ("user_id");');
  }

}
