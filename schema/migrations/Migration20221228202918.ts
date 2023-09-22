import { Migration } from '@mikro-orm/migrations';

export class Migration20221228202918 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "challenge_nonprofit_impressions" ("id" uuid not null, "user_id" uuid not null, "nonprofit_id" uuid not null, "source" text check ("source" in (\'CHALLENGE_EMAIL\', \'USER_PAGE\', \'USER_SIGNATURE\')) not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "challenge_nonprofit_impressions" add constraint "challenge_nonprofit_impressions_pkey" primary key ("id");');
    this.addSql('create index "challenge_nonprofit_impressions_user_id_index" on "challenge_nonprofit_impressions" ("user_id");');
    this.addSql('create index "challenge_nonprofit_impressions_nonprofit_id_index" on "challenge_nonprofit_impressions" ("nonprofit_id");');
  }

}
