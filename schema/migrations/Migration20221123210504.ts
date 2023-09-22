import { Migration } from '@mikro-orm/migrations';

export class Migration20221123210504 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "referral_code" varchar(5) null, add column "referred_by_user_id" uuid null;');
    this.addSql('create index "users_referral_code_index" on "users" ("referral_code");');
    this.addSql('alter table "users" add constraint "users_referred_by_user_id_foreign" foreign key ("referred_by_user_id") references "users" ("id") on update cascade on delete set null;');
  }

}
