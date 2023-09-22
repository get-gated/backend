import { Migration } from '@mikro-orm/migrations';

export class Migration20220320170102 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_tasks" ("id" uuid not null, "user_id" uuid not null, "task" text check ("task" in (\'CHOOSE_NONPROFIT\', \'TRAIN_DOMAINS\', \'INBOX_BASICS\')) not null, "resolution" text check ("resolution" in (\'COMPLETED\', \'DISMISSED\')) null, "created_at" timestamptz(0) not null, "resolved_at" timestamptz(0) null);');
    this.addSql('alter table "user_tasks" add constraint "user_tasks_pkey" primary key ("id");');
    this.addSql('create index "user_tasks_user_id_index" on "user_tasks" ("user_id");');
  }

}
