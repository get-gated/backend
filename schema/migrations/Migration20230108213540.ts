import { Migration } from '@mikro-orm/migrations';

export class Migration20230108213540 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "notification_push_tokens" ("id" uuid not null, "user_id" uuid not null, "token" varchar(255) not null, "device" varchar(255) not null, "created_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null);');
    this.addSql('alter table "notification_push_tokens" add constraint "notification_push_tokens_pkey" primary key ("id");');
    this.addSql('create index "notification_push_tokens_user_id_index" on "notification_push_tokens" ("user_id");');
    this.addSql('create index "notification_push_tokens_token_index" on "notification_push_tokens" ("token");');
    this.addSql('alter table "notification_push_tokens" add constraint "notification_push_tokens_token_unique" unique ("token");');

    this.addSql('create table "notification_push_receipts" ("id" uuid not null, "token_id" uuid not null, "body" varchar(255) not null, "data" jsonb null, "badge" int4 not null, "error" jsonb null, "sent_at" timestamptz(0) not null, "confirmed_at" timestamptz(0) null);');
    this.addSql('alter table "notification_push_receipts" add constraint "notification_push_receipts_pkey" primary key ("id");');
    this.addSql('create index "notification_push_receipts_token_id_index" on "notification_push_receipts" ("token_id");');

    this.addSql('alter table "notification_user_settings" add column "unread" int4 not null default 0;');

    this.addSql('alter table "notification_push_receipts" add constraint "notification_push_receipts_token_id_foreign" foreign key ("token_id") references "notification_push_tokens" ("id") on update cascade;');

  }

}
