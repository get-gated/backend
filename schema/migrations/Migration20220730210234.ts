import { Migration } from '@mikro-orm/migrations';

export class Migration20220730210234 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "challenge_injected_messages" ("id" uuid not null, "message_id" uuid not null, "user_id" uuid not null, "connection_id" uuid not null, "body" text not null, "reply_to_message_id" uuid not null, "responding_to" text check ("responding_to" in (\'CLICKED\', \'OPENED\', \'DONATED\', \'EXPECTED\', \'USER_REPLIED\')) not null, "from_email" varchar(255) not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "challenge_injected_messages" add constraint "challenge_injected_messages_pkey" primary key ("id");');
  }

}
