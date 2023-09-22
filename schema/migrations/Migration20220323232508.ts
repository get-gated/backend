import { Migration } from '@mikro-orm/migrations';

export class Migration20220323232508 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "is_signup_completed" bool not null default false;');
  }

}
