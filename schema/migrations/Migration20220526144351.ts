import { Migration } from '@mikro-orm/migrations';

export class Migration20220526144351 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "is_disabled" bool null, add column "disabled_at" timestamptz(0) null;');
    this.addSql('update "users" set "is_disabled" = false;');
    this.addSql('alter table "users" alter column "is_disabled" set not null;');
  }

}
